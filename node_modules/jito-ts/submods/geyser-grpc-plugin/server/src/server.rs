use std::{
    collections::{HashMap, HashSet},
    fmt::{Debug, Display, Formatter},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    thread::{Builder, JoinHandle},
    time::{Duration, Instant},
};

use crossbeam_channel::{tick, unbounded, Receiver, RecvError, Sender};
use jito_geyser_protos::solana::geyser::{
    geyser_server::Geyser, maybe_partial_account_update, EmptyRequest,
    GetHeartbeatIntervalResponse, Heartbeat, MaybePartialAccountUpdate, PartialAccountUpdate,
    SubscribeAccountUpdatesRequest, SubscribeBlockUpdatesRequest,
    SubscribePartialAccountUpdatesRequest, SubscribeProgramsUpdatesRequest,
    SubscribeSlotUpdateRequest, SubscribeTransactionUpdatesRequest, TimestampedAccountUpdate,
    TimestampedBlockUpdate, TimestampedSlotUpdate, TimestampedTransactionUpdate,
};
use log::*;
use once_cell::sync::OnceCell;
use serde_derive::Deserialize;
use thiserror::Error;
use tokio::sync::mpsc::{channel, error::TrySendError as TokioTrySendError, Sender as TokioSender};
use tonic::{metadata::MetadataValue, Request, Response, Status};
use uuid::Uuid;

use crate::subscription_stream::{StreamClosedSender, SubscriptionStream};

static VOTE_PROGRAM_ID: OnceCell<Vec<u8>> = OnceCell::new();

pub const HIGHEST_WRITE_SLOT_HEADER: &str = "highest-write-slot";

#[derive(Clone)]
struct SubscriptionClosedSender {
    inner: Sender<SubscriptionClosedEvent>,
}

impl StreamClosedSender<SubscriptionClosedEvent> for SubscriptionClosedSender {
    type Error = crossbeam_channel::TrySendError<SubscriptionClosedEvent>;

    fn send(&self, event: SubscriptionClosedEvent) -> Result<(), Self::Error> {
        self.inner.try_send(event)
    }
}

type AccountUpdateSender = TokioSender<Result<TimestampedAccountUpdate, Status>>;
type PartialAccountUpdateSender = TokioSender<Result<MaybePartialAccountUpdate, Status>>;
type SlotUpdateSender = TokioSender<Result<TimestampedSlotUpdate, Status>>;
type TransactionUpdateSender = TokioSender<Result<TimestampedTransactionUpdate, Status>>;
type BlockUpdateSender = TokioSender<Result<TimestampedBlockUpdate, Status>>;

trait AccountUpdateStreamer<T> {
    fn stream_update(&self, update: &T) -> GeyserServiceResult<()>;
}

trait HeartbeatStreamer {
    fn send_heartbeat(&self) -> GeyserServiceResult<()>;
}

trait ErrorStatusStreamer {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()>;
}

struct AccountUpdateSubscription {
    notification_sender: AccountUpdateSender,
    accounts: HashSet<Vec<u8>>,
}

impl ErrorStatusStreamer for AccountUpdateSubscription {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()> {
        self.notification_sender
            .try_send(Err(status))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

struct PartialAccountUpdateSubscription {
    subscription_tx: PartialAccountUpdateSender,
    skip_votes: bool,
}

impl AccountUpdateStreamer<PartialAccountUpdate> for PartialAccountUpdateSubscription {
    fn stream_update(&self, update: &PartialAccountUpdate) -> GeyserServiceResult<()> {
        if self.skip_votes
            && update.owner
                == *VOTE_PROGRAM_ID
                    .get_or_init(|| solana_program::vote::program::id().to_bytes().to_vec())
        {
            return Ok(());
        }

        let update = MaybePartialAccountUpdate {
            msg: Some(maybe_partial_account_update::Msg::PartialAccountUpdate(
                update.clone(),
            )),
        };
        self.subscription_tx
            .try_send(Ok(update))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

impl HeartbeatStreamer for PartialAccountUpdateSubscription {
    fn send_heartbeat(&self) -> GeyserServiceResult<()> {
        self.subscription_tx
            .try_send(Ok(MaybePartialAccountUpdate {
                msg: Some(maybe_partial_account_update::Msg::Hb(Heartbeat {})),
            }))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

impl ErrorStatusStreamer for PartialAccountUpdateSubscription {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()> {
        self.subscription_tx
            .try_send(Err(status))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

struct SlotUpdateSubscription {
    subscription_tx: SlotUpdateSender,
}

impl ErrorStatusStreamer for SlotUpdateSubscription {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()> {
        self.subscription_tx
            .try_send(Err(status))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

struct BlockUpdateSubscription {
    notification_sender: BlockUpdateSender,
}

impl ErrorStatusStreamer for BlockUpdateSubscription {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()> {
        self.notification_sender
            .try_send(Err(status))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

struct TransactionUpdateSubscription {
    notification_sender: TransactionUpdateSender,
}

impl ErrorStatusStreamer for TransactionUpdateSubscription {
    fn stream_error(&self, status: Status) -> GeyserServiceResult<()> {
        self.notification_sender
            .try_send(Err(status))
            .map_err(|e| match e {
                TokioTrySendError::Full(_) => GeyserServiceError::NotificationReceiverFull,
                TokioTrySendError::Closed(_) => {
                    GeyserServiceError::NotificationReceiverDisconnected
                }
            })
    }
}

#[allow(clippy::enum_variant_names)]
enum SubscriptionAddedEvent {
    AccountUpdateSubscription {
        uuid: Uuid,
        notification_sender: AccountUpdateSender,
        accounts: HashSet<Vec<u8>>,
    },
    ProgramUpdateSubscription {
        uuid: Uuid,
        notification_sender: AccountUpdateSender,
        programs: HashSet<Vec<u8>>,
    },
    PartialAccountUpdateSubscription {
        uuid: Uuid,
        notification_sender: PartialAccountUpdateSender,
        skip_votes: bool,
    },
    SlotUpdateSubscription {
        uuid: Uuid,
        notification_sender: SlotUpdateSender,
    },
    TransactionUpdateSubscription {
        uuid: Uuid,
        notification_sender: TransactionUpdateSender,
    },
    BlockUpdateSubscription {
        uuid: Uuid,
        notification_sender: BlockUpdateSender,
    },
}

impl Debug for SubscriptionAddedEvent {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let (sub_name, sub_id) = match self {
            SubscriptionAddedEvent::AccountUpdateSubscription { uuid, .. } => {
                ("subscribe_account_update".to_string(), uuid)
            }
            SubscriptionAddedEvent::PartialAccountUpdateSubscription { uuid, .. } => {
                ("subscribe_partial_account_update".to_string(), uuid)
            }
            SubscriptionAddedEvent::SlotUpdateSubscription { uuid, .. } => {
                ("subscribe_slot_update".to_string(), uuid)
            }
            SubscriptionAddedEvent::ProgramUpdateSubscription { uuid, .. } => {
                ("program_update_subscribe".to_string(), uuid)
            }
            SubscriptionAddedEvent::TransactionUpdateSubscription { uuid, .. } => {
                ("transaction_update_subscribe".to_string(), uuid)
            }
            SubscriptionAddedEvent::BlockUpdateSubscription { uuid, .. } => {
                ("block_update_subscribe".to_string(), uuid)
            }
        };
        writeln!(
            f,
            "subscription type: {sub_name}, subscription id: {sub_id}",
        )
    }
}

impl Display for SubscriptionAddedEvent {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&self, f)
    }
}

#[allow(clippy::enum_variant_names)]
#[derive(Debug)]
enum SubscriptionClosedEvent {
    AccountUpdateSubscription(Uuid),
    ProgramUpdateSubscription(Uuid),
    PartialAccountUpdateSubscription(Uuid),
    SlotUpdateSubscription(Uuid),
    TransactionUpdateSubscription(Uuid),
    BlockUpdateSubscription(Uuid),
}

#[derive(Error, Debug)]
pub enum GeyserServiceError {
    #[error("GeyserStreamMessageError")]
    GeyserStreamMessageError(#[from] RecvError),

    #[error("The receiving side of the channel is full")]
    NotificationReceiverFull,

    #[error("The receiver is disconnected")]
    NotificationReceiverDisconnected,
}

type GeyserServiceResult<T> = Result<T, GeyserServiceError>;

#[derive(Clone, Debug, Deserialize)]
pub struct GeyserServiceConfig {
    /// Cadence of heartbeats.
    heartbeat_interval_ms: u64,

    /// Individual subscriber buffer size.
    subscriber_buffer_size: usize,
}

pub struct GeyserService {
    /// Highest slot observed for a write, thus far.
    /// This value is returned in the http headers to clients on initial connection.
    highest_write_slot: Arc<AtomicU64>,

    /// General service configurations.
    service_config: GeyserServiceConfig,

    /// Used to add new subscriptions.
    subscription_added_tx: Sender<SubscriptionAddedEvent>,

    /// Used to close existing subscriptions.
    subscription_closed_sender: SubscriptionClosedSender,

    /// Internal event loop thread.
    t_hdl: JoinHandle<()>,
}

impl GeyserService {
    pub fn new(
        service_config: GeyserServiceConfig,
        // Account updates streamed from the validator.
        account_update_rx: Receiver<TimestampedAccountUpdate>,
        // Slot updates streamed from the validator.
        slot_update_rx: Receiver<TimestampedSlotUpdate>,
        // Block metadata receiver
        block_update_receiver: Receiver<TimestampedBlockUpdate>,
        // Transaction updates
        transaction_update_receiver: Receiver<TimestampedTransactionUpdate>,
        // This value is maintained in the upstream context.
        highest_write_slot: Arc<AtomicU64>,
    ) -> Self {
        let (subscription_added_tx, subscription_added_rx) = unbounded();
        let (subscription_closed_tx, subscription_closed_rx) = unbounded();
        let heartbeat_tick = tick(Duration::from_millis(service_config.heartbeat_interval_ms));

        let t_hdl = Self::event_loop(
            account_update_rx,
            slot_update_rx,
            block_update_receiver,
            transaction_update_receiver,
            subscription_added_rx,
            subscription_closed_rx,
            heartbeat_tick,
        );

        Self {
            highest_write_slot,
            service_config,
            subscription_added_tx,
            subscription_closed_sender: SubscriptionClosedSender {
                inner: subscription_closed_tx,
            },
            t_hdl,
        }
    }

    pub fn join(self) {
        self.t_hdl.join().unwrap();
    }

    /// Main event loop that handles the following:
    ///     1. Add new subscriptions.
    ///     2. Cleanup closed subscriptions.
    ///     3. Receive geyser events and stream them to subscribers.
    fn event_loop(
        account_update_rx: Receiver<TimestampedAccountUpdate>,
        slot_update_rx: Receiver<TimestampedSlotUpdate>,
        block_update_receiver: Receiver<TimestampedBlockUpdate>,
        transaction_update_receiver: Receiver<TimestampedTransactionUpdate>,
        subscription_added_rx: Receiver<SubscriptionAddedEvent>,
        subscription_closed_rx: Receiver<SubscriptionClosedEvent>,
        heartbeat_tick: Receiver<Instant>,
    ) -> JoinHandle<()> {
        Builder::new()
            .name("geyser-service-event-loop".to_string())
            .spawn(move || {
                info!("Starting event loop");
                let mut account_update_subscriptions: HashMap<Uuid, AccountUpdateSubscription> =
                    HashMap::new();
                let mut program_update_subscriptions: HashMap<Uuid, AccountUpdateSubscription> =
                    HashMap::new();
                let mut partial_account_update_subscriptions: HashMap<
                    Uuid,
                    PartialAccountUpdateSubscription,
                > = HashMap::new();
                let mut slot_update_subscriptions: HashMap<Uuid, SlotUpdateSubscription> = HashMap::new();

                let mut transaction_update_subscriptions: HashMap<Uuid, TransactionUpdateSubscription> = HashMap::new();
                let mut block_update_subscriptions: HashMap<Uuid, BlockUpdateSubscription> = HashMap::new();

                loop {
                    crossbeam_channel::select! {
                        recv(heartbeat_tick) -> _ => {
                            debug!("sending heartbeats");
                            let failed_subscription_ids = Self::send_heartbeats(&partial_account_update_subscriptions);
                            Self::drop_subscriptions(&failed_subscription_ids, &mut partial_account_update_subscriptions);
                        }
                        recv(subscription_added_rx) -> maybe_subscription_added => {
                            info!("received new subscription");
                            if let Err(e) = Self::handle_subscription_added(maybe_subscription_added, &mut account_update_subscriptions, &mut partial_account_update_subscriptions, &mut slot_update_subscriptions, &mut program_update_subscriptions, &mut transaction_update_subscriptions, &mut block_update_subscriptions) {
                                error!("error adding new subscription: {}", e);
                                return;
                            }
                        },
                        recv(subscription_closed_rx) -> maybe_subscription_closed => {
                            info!("closing subscription");
                            if let Err(e) = Self::handle_subscription_closed(maybe_subscription_closed, &mut account_update_subscriptions, &mut partial_account_update_subscriptions, &mut slot_update_subscriptions, &mut program_update_subscriptions, &mut transaction_update_subscriptions, &mut block_update_subscriptions) {
                                error!("error closing existing subscription: {}", e);
                                return;
                            }
                        },
                        recv(account_update_rx) -> maybe_account_update => {
                            debug!("received account update");
                            match Self::handle_account_update_event(maybe_account_update, &account_update_subscriptions, &partial_account_update_subscriptions, &program_update_subscriptions) {
                                Err(e) => {
                                    error!("error handling an account update event: {}", e);
                                    return;
                                },
                                Ok(failed_subscription_ids) => {
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut account_update_subscriptions);
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut partial_account_update_subscriptions);
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut program_update_subscriptions);
                                },
                            }
                        },
                        recv(slot_update_rx) -> maybe_slot_update => {
                            debug!("received slot update");
                            match Self::handle_slot_update_event(maybe_slot_update, &slot_update_subscriptions) {
                                Err(e) => {
                                    error!("error handling a slot update event: {}", e);
                                    return;
                                },
                                Ok(failed_subscription_ids) => {
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut slot_update_subscriptions);
                                },
                            }
                        },
                        recv(block_update_receiver) -> maybe_block_update => {
                            debug!("received block update");
                            match Self::handle_block_update_event(maybe_block_update, &block_update_subscriptions) {
                                Err(e) => {
                                    error!("error handling a block update event: {}", e);
                                    return;
                                },
                                Ok(failed_subscription_ids) => {
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut block_update_subscriptions);
                                },
                            }
                        },
                        recv(transaction_update_receiver) -> maybe_transaction_update => {
                            debug!("received transaction update");
                            match Self::handle_transaction_update_event(maybe_transaction_update, &transaction_update_subscriptions) {
                                Err(e) => {
                                    error!("error handling a transaction update event: {}", e);
                                    return;
                                },
                                Ok(failed_subscription_ids) => {
                                    Self::drop_subscriptions(&failed_subscription_ids, &mut transaction_update_subscriptions);
                                },
                            }
                        },
                    }
                }
            })
            .unwrap()
    }

    fn handle_block_update_event(
        maybe_block_update: Result<TimestampedBlockUpdate, RecvError>,
        subscriptions: &HashMap<Uuid, BlockUpdateSubscription>,
    ) -> GeyserServiceResult<Vec<Uuid>> {
        let block_update = maybe_block_update?;
        Ok(subscriptions
            .iter()
            .filter_map(|(uuid, sub)| {
                if matches!(
                    sub.notification_sender.try_send(Ok(block_update.clone())),
                    Err(TokioTrySendError::Closed(_))
                ) {
                    Some(*uuid)
                } else {
                    None
                }
            })
            .collect())
    }

    fn handle_transaction_update_event(
        maybe_transaction_update: Result<TimestampedTransactionUpdate, RecvError>,
        subscriptions: &HashMap<Uuid, TransactionUpdateSubscription>,
    ) -> GeyserServiceResult<Vec<Uuid>> {
        let transaction_update = maybe_transaction_update?;
        Ok(subscriptions
            .iter()
            .filter_map(|(uuid, sub)| {
                if matches!(
                    sub.notification_sender
                        .try_send(Ok(transaction_update.clone())),
                    Err(TokioTrySendError::Closed(_))
                ) {
                    Some(*uuid)
                } else {
                    None
                }
            })
            .collect())
    }

    /// Handles adding new subscriptions.
    fn handle_subscription_added(
        maybe_subscription_added: Result<SubscriptionAddedEvent, RecvError>,
        account_update_subscriptions: &mut HashMap<Uuid, AccountUpdateSubscription>,
        partial_account_update_subscriptions: &mut HashMap<Uuid, PartialAccountUpdateSubscription>,
        slot_update_subscriptions: &mut HashMap<Uuid, SlotUpdateSubscription>,
        program_update_subscriptions: &mut HashMap<Uuid, AccountUpdateSubscription>,
        transaction_update_subscriptions: &mut HashMap<Uuid, TransactionUpdateSubscription>,
        block_update_subscriptions: &mut HashMap<Uuid, BlockUpdateSubscription>,
    ) -> GeyserServiceResult<()> {
        let subscription_added = maybe_subscription_added?;
        info!("new subscription: {:?}", subscription_added);

        match subscription_added {
            SubscriptionAddedEvent::AccountUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
                accounts,
            } => {
                account_update_subscriptions.insert(
                    uuid,
                    AccountUpdateSubscription {
                        notification_sender: subscription_tx,
                        accounts,
                    },
                );
            }
            SubscriptionAddedEvent::PartialAccountUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
                skip_votes,
            } => {
                partial_account_update_subscriptions.insert(
                    uuid,
                    PartialAccountUpdateSubscription {
                        subscription_tx,
                        skip_votes,
                    },
                );
            }
            SubscriptionAddedEvent::SlotUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
            } => {
                slot_update_subscriptions.insert(uuid, SlotUpdateSubscription { subscription_tx });
            }
            SubscriptionAddedEvent::ProgramUpdateSubscription {
                uuid,
                notification_sender,
                programs,
            } => {
                program_update_subscriptions.insert(
                    uuid,
                    AccountUpdateSubscription {
                        notification_sender,
                        accounts: programs,
                    },
                );
            }
            SubscriptionAddedEvent::TransactionUpdateSubscription {
                uuid,
                notification_sender,
            } => {
                transaction_update_subscriptions.insert(
                    uuid,
                    TransactionUpdateSubscription {
                        notification_sender,
                    },
                );
            }
            SubscriptionAddedEvent::BlockUpdateSubscription {
                uuid,
                notification_sender,
            } => {
                block_update_subscriptions.insert(
                    uuid,
                    BlockUpdateSubscription {
                        notification_sender,
                    },
                );
            }
        }

        Ok(())
    }

    /// Handles closing existing subscriptions.
    fn handle_subscription_closed(
        maybe_subscription_closed: Result<SubscriptionClosedEvent, RecvError>,
        account_update_subscriptions: &mut HashMap<Uuid, AccountUpdateSubscription>,
        partial_account_update_subscriptions: &mut HashMap<Uuid, PartialAccountUpdateSubscription>,
        slot_update_subscriptions: &mut HashMap<Uuid, SlotUpdateSubscription>,
        program_update_subscriptions: &mut HashMap<Uuid, AccountUpdateSubscription>,
        transaction_update_subscriptions: &mut HashMap<Uuid, TransactionUpdateSubscription>,
        block_update_subscriptions: &mut HashMap<Uuid, BlockUpdateSubscription>,
    ) -> GeyserServiceResult<()> {
        let subscription_closed = maybe_subscription_closed?;
        info!("closing subscription: {:?}", subscription_closed);

        match subscription_closed {
            SubscriptionClosedEvent::AccountUpdateSubscription(subscription_id) => {
                let _ = account_update_subscriptions.remove(&subscription_id);
            }
            SubscriptionClosedEvent::PartialAccountUpdateSubscription(subscription_id) => {
                let _ = partial_account_update_subscriptions.remove(&subscription_id);
            }
            SubscriptionClosedEvent::SlotUpdateSubscription(subscription_id) => {
                let _ = slot_update_subscriptions.remove(&subscription_id);
            }
            SubscriptionClosedEvent::ProgramUpdateSubscription(subscription_id) => {
                let _ = program_update_subscriptions.remove(&subscription_id);
            }
            SubscriptionClosedEvent::TransactionUpdateSubscription(subscription_id) => {
                let _ = transaction_update_subscriptions.remove(&subscription_id);
            }
            SubscriptionClosedEvent::BlockUpdateSubscription(subscription_id) => {
                let _ = block_update_subscriptions.remove(&subscription_id);
            }
        }

        Ok(())
    }

    /// Streams account updates to subscribers.
    fn handle_account_update_event(
        maybe_account_update: Result<TimestampedAccountUpdate, RecvError>,
        account_update_subscriptions: &HashMap<Uuid, AccountUpdateSubscription>,
        partial_account_update_subscriptions: &HashMap<Uuid, PartialAccountUpdateSubscription>,
        program_update_subscriptions: &HashMap<Uuid, AccountUpdateSubscription>,
    ) -> GeyserServiceResult<Vec<Uuid>> {
        let account_update = maybe_account_update?;
        let update = account_update.account_update.as_ref().unwrap();

        let failed_account_update_sends =
            account_update_subscriptions
                .iter()
                .filter_map(|(uuid, sub)| {
                    if sub.accounts.contains(update.pubkey.as_slice())
                        && matches!(
                            sub.notification_sender.try_send(Ok(account_update.clone())),
                            Err(TokioTrySendError::Closed(_))
                        )
                    {
                        Some(*uuid)
                    } else {
                        None
                    }
                });

        let failed_program_update_sends =
            program_update_subscriptions
                .iter()
                .filter_map(|(uuid, sub)| {
                    if sub.accounts.contains(update.owner.as_slice())
                        && matches!(
                            sub.notification_sender.try_send(Ok(account_update.clone())),
                            Err(TokioTrySendError::Closed(_))
                        )
                    {
                        Some(*uuid)
                    } else {
                        None
                    }
                });

        let partial_account_update = PartialAccountUpdate {
            slot: update.slot,
            pubkey: update.pubkey.clone(),
            owner: update.owner.clone(),
            is_startup: update.is_startup,
            seq: update.seq,
            tx_signature: update.tx_signature.clone(),
            replica_version: update.replica_version,
        };

        let failed_partial_account_update_sends = partial_account_update_subscriptions
            .iter()
            .filter_map(|(uuid, sub)| {
                if matches!(
                    sub.stream_update(&partial_account_update),
                    Err(GeyserServiceError::NotificationReceiverDisconnected)
                ) {
                    Some(*uuid)
                } else {
                    None
                }
            });

        Ok(failed_account_update_sends
            .into_iter()
            .chain(failed_partial_account_update_sends.into_iter())
            .chain(failed_program_update_sends.into_iter())
            .collect())
    }

    fn send_heartbeats<S: HeartbeatStreamer>(subscriptions: &HashMap<Uuid, S>) -> Vec<Uuid> {
        let mut failed_subscription_ids = vec![];
        for (sub_id, sub) in subscriptions {
            if let Err(GeyserServiceError::NotificationReceiverDisconnected) = sub.send_heartbeat()
            {
                warn!("client uuid disconnected: {}", sub_id);
                failed_subscription_ids.push(*sub_id);
            }
        }

        failed_subscription_ids
    }

    /// Streams slot updates to subscribers
    /// Returns a vector of UUIDs that failed to send to due to the subscription being closed
    fn handle_slot_update_event(
        maybe_slot_update: Result<TimestampedSlotUpdate, RecvError>,
        slot_update_subscriptions: &HashMap<Uuid, SlotUpdateSubscription>,
    ) -> GeyserServiceResult<Vec<Uuid>> {
        let slot_update = maybe_slot_update?;
        let failed_subscription_ids = slot_update_subscriptions
            .iter()
            .filter_map(|(uuid, sub)| {
                if matches!(
                    sub.subscription_tx.try_send(Ok(slot_update.clone())),
                    Err(TokioTrySendError::Closed(_))
                ) {
                    Some(*uuid)
                } else {
                    None
                }
            })
            .collect();

        Ok(failed_subscription_ids)
    }

    /// Drop broken connections.
    fn drop_subscriptions<S: ErrorStatusStreamer>(
        subscription_ids: &[Uuid],
        subscriptions: &mut HashMap<Uuid, S>,
    ) {
        for sub_id in subscription_ids {
            if let Some(sub) = subscriptions.remove(sub_id) {
                let _ = sub.stream_error(Status::failed_precondition("broken connection"));
            }
        }
    }
}

#[tonic::async_trait]
impl Geyser for GeyserService {
    async fn get_heartbeat_interval(
        &self,
        _request: Request<EmptyRequest>,
    ) -> Result<Response<GetHeartbeatIntervalResponse>, Status> {
        return Ok(Response::new(GetHeartbeatIntervalResponse {
            heartbeat_interval_ms: self.service_config.heartbeat_interval_ms,
        }));
    }

    type SubscribeAccountUpdatesStream = SubscriptionStream<Uuid, TimestampedAccountUpdate>;
    async fn subscribe_account_updates(
        &self,
        request: Request<SubscribeAccountUpdatesRequest>,
    ) -> Result<Response<Self::SubscribeAccountUpdatesStream>, Status> {
        let (notification_sender, notification_receiver) =
            channel(self.service_config.subscriber_buffer_size);

        let accounts: HashSet<Vec<u8>> = request.into_inner().accounts.into_iter().collect();
        let all_valid_pubkeys = accounts.iter().all(|a| a.len() == 32);
        if !all_valid_pubkeys {
            return Err(Status::invalid_argument(
                "a pubkey with length != 32 was provided",
            ));
        }

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::AccountUpdateSubscription {
                uuid,
                notification_sender,
                accounts,
            })
            .map_err(|e| {
                error!(
                    "failed to add subscribe_account_updates subscription: {}",
                    e
                );
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            notification_receiver,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::AccountUpdateSubscription(uuid),
            ),
            "subscribe_account_updates",
        );
        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );

        Ok(resp)
    }

    type SubscribeProgramUpdatesStream = SubscriptionStream<Uuid, TimestampedAccountUpdate>;

    async fn subscribe_program_updates(
        &self,
        request: Request<SubscribeProgramsUpdatesRequest>,
    ) -> Result<Response<Self::SubscribeProgramUpdatesStream>, Status> {
        let (notification_sender, notification_receiver) =
            channel(self.service_config.subscriber_buffer_size);

        let programs: HashSet<Vec<u8>> = request.into_inner().programs.into_iter().collect();
        let all_valid_pubkeys = programs.iter().all(|a| a.len() == 32);
        if !all_valid_pubkeys {
            return Err(Status::invalid_argument(
                "a pubkey with length != 32 was provided",
            ));
        }

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::ProgramUpdateSubscription {
                uuid,
                notification_sender,
                programs,
            })
            .map_err(|e| {
                error!(
                    "failed to add subscribe_account_updates subscription: {}",
                    e
                );
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            notification_receiver,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::ProgramUpdateSubscription(uuid),
            ),
            "subscribe_program_updates",
        );
        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );

        Ok(resp)
    }

    type SubscribePartialAccountUpdatesStream = SubscriptionStream<Uuid, MaybePartialAccountUpdate>;
    async fn subscribe_partial_account_updates(
        &self,
        request: Request<SubscribePartialAccountUpdatesRequest>,
    ) -> Result<Response<Self::SubscribePartialAccountUpdatesStream>, Status> {
        let (subscription_tx, subscription_rx) =
            channel(self.service_config.subscriber_buffer_size);

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::PartialAccountUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
                skip_votes: request.into_inner().skip_vote_accounts,
            })
            .map_err(|e| {
                error!(
                    "failed to add subscribe_partial_account_updates subscription: {}",
                    e
                );
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            subscription_rx,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::PartialAccountUpdateSubscription(uuid),
            ),
            "subscribe_partial_account_updates",
        );
        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );

        Ok(resp)
    }

    type SubscribeSlotUpdatesStream = SubscriptionStream<Uuid, TimestampedSlotUpdate>;
    async fn subscribe_slot_updates(
        &self,
        _request: Request<SubscribeSlotUpdateRequest>,
    ) -> Result<Response<Self::SubscribeSlotUpdatesStream>, Status> {
        let (subscription_tx, subscription_rx) =
            channel(self.service_config.subscriber_buffer_size);

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::SlotUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
            })
            .map_err(|e| {
                error!("failed to add subscribe_slot_updates subscription: {}", e);
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            subscription_rx,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::SlotUpdateSubscription(uuid),
            ),
            "subscribe_slot_updates",
        );
        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );

        Ok(resp)
    }

    type SubscribeTransactionUpdatesStream = SubscriptionStream<Uuid, TimestampedTransactionUpdate>;

    async fn subscribe_transaction_updates(
        &self,
        _request: Request<SubscribeTransactionUpdatesRequest>,
    ) -> Result<Response<Self::SubscribeTransactionUpdatesStream>, Status> {
        let (subscription_tx, subscription_rx) =
            channel(self.service_config.subscriber_buffer_size);

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::TransactionUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
            })
            .map_err(|e| {
                error!(
                    "failed to add subscribe_transaction_updates subscription: {}",
                    e
                );
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            subscription_rx,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::TransactionUpdateSubscription(uuid),
            ),
            "subscribe_transaction_updates",
        );

        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );
        Ok(resp)
    }

    type SubscribeBlockUpdatesStream = SubscriptionStream<Uuid, TimestampedBlockUpdate>;
    async fn subscribe_block_updates(
        &self,
        _request: Request<SubscribeBlockUpdatesRequest>,
    ) -> Result<Response<Self::SubscribeBlockUpdatesStream>, Status> {
        let (subscription_tx, subscription_rx) =
            channel(self.service_config.subscriber_buffer_size);

        let uuid = Uuid::new_v4();
        self.subscription_added_tx
            .try_send(SubscriptionAddedEvent::BlockUpdateSubscription {
                uuid,
                notification_sender: subscription_tx,
            })
            .map_err(|e| {
                error!("failed to add subscribe_block_updates subscription: {}", e);
                Status::internal("error adding subscription")
            })?;

        let stream = SubscriptionStream::new(
            subscription_rx,
            uuid,
            (
                self.subscription_closed_sender.clone(),
                SubscriptionClosedEvent::BlockUpdateSubscription(uuid),
            ),
            "subscribe_block_updates",
        );

        let mut resp = Response::new(stream);
        resp.metadata_mut().insert(
            HIGHEST_WRITE_SLOT_HEADER,
            MetadataValue::from(self.highest_write_slot.load(Ordering::Relaxed)),
        );
        Ok(resp)
    }
}
