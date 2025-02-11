//! Takes an opinionated approach to how account updates shall be consumed. Exposes APIs to consume
//! partial and full updates.
//!
//! Clients using this consumer can expect the following:
//!     1. Account updates will be streamed in monotonically; i.e. updates for older slots
//!        are discarded in the event that they were streamed by the server late.
//!     2. Account updates received out of order will trigger an error.

use std::{
    collections::HashMap,
    num::{NonZeroUsize, ParseIntError},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Arc,
    },
    time::Duration,
};

use jito_geyser_protos::solana::geyser::{
    geyser_client::GeyserClient, maybe_partial_account_update, EmptyRequest,
    MaybePartialAccountUpdate, SubscribeAccountUpdatesRequest,
    SubscribePartialAccountUpdatesRequest, SubscribeSlotUpdateRequest, TimestampedAccountUpdate,
};
use log::*;
use lru::LruCache;
use thiserror::Error;
use tokio::{
    sync::mpsc::UnboundedSender,
    time::{interval, Instant},
};
use tonic::{codegen::InterceptedService, transport::Channel, Response, Status};

use crate::{
    geyser_consumer::GeyserConsumerError::{MissedHeartbeat, StreamClosed},
    types::{AccountUpdate, AccountUpdateNotification, PartialAccountUpdate, SlotUpdate},
    GrpcInterceptor, Pubkey, Slot,
};

#[derive(Error, Debug)]
pub enum GeyserConsumerError {
    #[error("ConsumerChannelDisconnected")]
    ConsumerChannelDisconnected,

    #[error("GrpcError {0}")]
    GrpcError(#[from] Status),

    #[error("MalformedResponse {0}")]
    MalformedResponse(String),

    #[error("MissedHeartbeat")]
    MissedHeartbeat,

    #[error("StaleAccountUpdate update_slot={update_slot:?}, rooted_slot={rooted_slot:?}")]
    StaleAccountUpdate { update_slot: u64, rooted_slot: u64 },

    #[error("OutOfOrderSeqAccountUpdate update_slot={update_slot:?}, rooted_slot={rooted_slot:?}, actual_global_seq={actual_global_seq:?}, expected_global_seq={expected_global_seq:?}")]
    OutOfOrderSeqAccountUpdate {
        update_slot: u64,
        rooted_slot: u64,
        actual_global_seq: u64,
        expected_global_seq: u64,
    },

    #[error("StreamClosed")]
    StreamClosed,
}

pub type Result<T> = std::result::Result<T, GeyserConsumerError>;

// Assuming updates are mostly streamed in order, the oldest entry will be ~33 minutes old before it's pruned.
// This assumes 400ms block times.
const ACCOUNT_WRITE_SEQS_CACHE_SIZE: usize = 5_000;
pub type AccountWriteSeqsCache = LruCache<Slot, HashMap<Pubkey, AccountWriteSeq>>;

pub const HIGHEST_WRITE_SLOT_HEADER: &str = "highest-write-slot";

#[derive(Clone)]
pub struct AccountWriteSeq {
    /// This account's write sequence since the first write.
    global_seq: u64,

    /// This account's write sequence within a slot.
    slot_seq: u64,
}

#[derive(Clone)]
pub struct GeyserConsumer {
    /// Geyser client.
    client: GeyserClient<InterceptedService<Channel, GrpcInterceptor>>,

    /// Exit signal.
    exit: Arc<AtomicBool>,
}

impl GeyserConsumer {
    pub fn new(
        client: GeyserClient<InterceptedService<Channel, GrpcInterceptor>>,
        exit: Arc<AtomicBool>,
    ) -> Self {
        Self { client, exit }
    }

    pub async fn consume_account_updates(
        &self,
        account_updates_tx: UnboundedSender<AccountUpdate>,
        highest_rooted_slot: Arc<AtomicU64>,
        // Oldest slot from root consumer willing to tolerate.
        // e.g.
        //    current slot = 12, max_rooted_slot_distance = 6
        //    new slot = 13
        //    new slot = 6 -> Error
        max_rooted_slot_distance: u64,
        accounts: Vec<Vec<u8>>,
    ) -> Result<()> {
        let mut c = self.client.clone();
        let mut account_write_sequences =
            LruCache::new(NonZeroUsize::new(ACCOUNT_WRITE_SEQS_CACHE_SIZE).unwrap());

        let resp = c
            .subscribe_account_updates(SubscribeAccountUpdatesRequest { accounts })
            .await?;
        let oldest_write_slot = extract_highest_write_slot_header(&resp)?;
        let mut stream = resp.into_inner();

        let mut latest_write_slot = 0;
        let mut tick = interval(Duration::from_secs(1));

        while !self.exit.load(Ordering::Relaxed) {
            tokio::select! {
                maybe_message = stream.message() => {
                    if let Some(account_update) = Self::process_account_update(
                        maybe_message,
                        &mut account_write_sequences,
                        &highest_rooted_slot,
                        oldest_write_slot,
                        max_rooted_slot_distance,
                    )? {
                        latest_write_slot = latest_write_slot.max(account_update.slot);
                        if account_updates_tx.send(account_update).is_err() {
                            return Err(GeyserConsumerError::ConsumerChannelDisconnected);
                        }
                    }
                }
                _ = tick.tick() => {
                    // helpful for checking exit faster vs. blocking on stream.message()
                }
            }
        }

        Ok(())
    }

    pub async fn consume_partial_account_updates(
        &self,
        partial_account_updates_tx: UnboundedSender<PartialAccountUpdate>,
        highest_rooted_slot: Arc<AtomicU64>,
        max_rooted_slot_distance: u64,
        max_allowable_missed_heartbeats: usize,
        skip_vote_accounts: bool,
    ) -> Result<()> {
        let mut c = self.client.clone();
        let mut account_write_sequences =
            LruCache::new(NonZeroUsize::new(ACCOUNT_WRITE_SEQS_CACHE_SIZE).unwrap());

        let expected_heartbeat_interval_ms = c
            .get_heartbeat_interval(EmptyRequest {})
            .await?
            .into_inner()
            .heartbeat_interval_ms;

        let resp = c
            .subscribe_partial_account_updates(SubscribePartialAccountUpdatesRequest {
                skip_vote_accounts,
            })
            .await?;
        let oldest_write_slot = extract_highest_write_slot_header(&resp)?;
        let mut stream = resp.into_inner();

        let mut latest_write_slot = 0;
        let mut last_heartbeat = Instant::now();
        let heartbeat_expiration =
            expected_heartbeat_interval_ms * max_allowable_missed_heartbeats as u64;
        let heartbeat_expiration = Duration::from_millis(heartbeat_expiration);
        let mut expected_heartbeat_interval =
            interval(Duration::from_millis(expected_heartbeat_interval_ms));

        while !self.exit.load(Ordering::Relaxed) {
            tokio::select! {
                now = expected_heartbeat_interval.tick() => {
                    let heartbeat_expired = now.duration_since(last_heartbeat).gt(&heartbeat_expiration);
                    if heartbeat_expired {
                        return Err(MissedHeartbeat);
                    }
                }
                maybe_message = stream.message() => {
                    if let Some(account_update) = Self::process_partial_account_update(
                        maybe_message,
                        &mut account_write_sequences,
                        &highest_rooted_slot,
                        &mut last_heartbeat,
                        oldest_write_slot,
                        max_rooted_slot_distance,
                    ).await? {
                        latest_write_slot = latest_write_slot.max(account_update.slot);
                        if partial_account_updates_tx.send(account_update).is_err() {
                            return Err(GeyserConsumerError::ConsumerChannelDisconnected);
                        }
                    }
                }
            }
        }

        Ok(())
    }

    pub async fn consume_slot_updates(
        &self,
        slot_updates_tx: UnboundedSender<SlotUpdate>,
    ) -> Result<()> {
        let mut c = self.client.clone();

        let resp = c
            .subscribe_slot_updates(SubscribeSlotUpdateRequest {})
            .await?;
        let mut stream = resp.into_inner();

        while !self.exit.load(Ordering::Relaxed) {
            match stream.message().await {
                Ok(Some(slot_update)) => {
                    if slot_updates_tx
                        .send(slot_update.slot_update.unwrap().into())
                        .is_err()
                    {
                        return Err(GeyserConsumerError::ConsumerChannelDisconnected);
                    };
                }
                Ok(None) => return Err(StreamClosed),
                Err(e) => return Err(e.into()),
            }
        }

        Ok(())
    }

    #[allow(clippy::too_many_arguments)]
    fn process_account_update(
        maybe_message: std::result::Result<Option<TimestampedAccountUpdate>, Status>,
        account_write_sequences: &mut AccountWriteSeqsCache,
        highest_rooted_slot: &Arc<AtomicU64>,
        oldest_write_slot: Slot,
        max_rooted_slot_distance: u64,
    ) -> Result<Option<AccountUpdate>> {
        match maybe_message {
            Ok(Some(maybe_update)) => {
                let mut update: AccountUpdate = maybe_update.account_update.unwrap().into();
                if let Err(e) = Self::process_update(
                    &mut update,
                    account_write_sequences,
                    highest_rooted_slot,
                    max_rooted_slot_distance,
                    oldest_write_slot,
                ) {
                    error!("error processing update: {:?}", e);
                    Err(e)
                } else {
                    Ok(Some(update))
                }
            }
            Ok(None) => Err(StreamClosed),
            Err(e) => Err(e.into()),
        }
    }

    #[allow(clippy::too_many_arguments)]
    async fn process_partial_account_update(
        maybe_message: std::result::Result<Option<MaybePartialAccountUpdate>, Status>,
        account_write_sequences: &mut AccountWriteSeqsCache,
        highest_rooted_slot: &Arc<AtomicU64>,
        last_heartbeat: &mut Instant,
        oldest_write_slot: Slot,
        max_rooted_slot_distance: u64,
    ) -> Result<Option<PartialAccountUpdate>> {
        match maybe_message {
            Ok(Some(maybe_update)) => match maybe_update.msg {
                Some(maybe_partial_account_update::Msg::PartialAccountUpdate(update)) => {
                    let mut update: PartialAccountUpdate = update.into();
                    if let Err(e) = Self::process_update(
                        &mut update,
                        account_write_sequences,
                        highest_rooted_slot,
                        max_rooted_slot_distance,
                        oldest_write_slot,
                    ) {
                        error!("error processing update: {:?}", e);
                        Err(e)
                    } else {
                        Ok(Some(update))
                    }
                }
                Some(maybe_partial_account_update::Msg::Hb(_)) => {
                    *last_heartbeat = Instant::now();
                    Ok(None)
                }
                None => unreachable!("msg must be Some"),
            },
            Ok(None) => Err(StreamClosed),
            Err(e) => Err(e.into()),
        }
    }

    fn process_update<A: AccountUpdateNotification>(
        update: &mut A,
        account_write_sequences: &mut AccountWriteSeqsCache,
        highest_rooted_slot: &Arc<AtomicU64>,
        max_rooted_slot_distance: u64,
        oldest_write_slot: u64,
    ) -> Result<()> {
        let update_slot = update.slot();
        if update_slot < oldest_write_slot {
            return Err(GeyserConsumerError::StaleAccountUpdate {
                update_slot,
                rooted_slot: highest_rooted_slot.load(Ordering::Relaxed),
            });
        }

        if update_slot
            < highest_rooted_slot
                .load(Ordering::Relaxed)
                .checked_sub(max_rooted_slot_distance)
                .unwrap_or_default()
        {
            return Err(GeyserConsumerError::StaleAccountUpdate {
                update_slot,
                rooted_slot: highest_rooted_slot.load(Ordering::Relaxed),
            });
        }

        let update_seqs = account_write_sequences.get_or_insert_mut(update_slot, HashMap::default);
        let account_write_seq = update_seqs
            .entry(update.pubkey())
            .or_insert(AccountWriteSeq {
                global_seq: update.seq(),
                slot_seq: 0,
            });

        if update.seq() < account_write_seq.global_seq {
            return Err(GeyserConsumerError::OutOfOrderSeqAccountUpdate {
                update_slot,
                rooted_slot: highest_rooted_slot.load(Ordering::Relaxed),
                actual_global_seq: update.seq(),
                expected_global_seq: account_write_seq.global_seq,
            });
        }

        update.set_seq(account_write_seq.slot_seq);
        account_write_seq.slot_seq += 1;
        Ok(())
    }
}

fn extract_highest_write_slot_header<T>(resp: &Response<T>) -> Result<Slot> {
    if let Some(highest_write_slot) = resp.metadata().get(HIGHEST_WRITE_SLOT_HEADER) {
        let highest_write_slot = highest_write_slot.to_str().map_err(|e| {
            GeyserConsumerError::MalformedResponse(format!(
                "error deserializing {HIGHEST_WRITE_SLOT_HEADER} header: {e}",
            ))
        })?;
        let highest_write_slot: Slot = highest_write_slot.parse().map_err(|e: ParseIntError| {
            GeyserConsumerError::MalformedResponse(format!(
                "error parsing {HIGHEST_WRITE_SLOT_HEADER} header: {e}",
            ))
        })?;

        Ok(highest_write_slot)
    } else {
        Err(GeyserConsumerError::MalformedResponse(format!(
            "missing {HIGHEST_WRITE_SLOT_HEADER} header",
        )))
    }
}
