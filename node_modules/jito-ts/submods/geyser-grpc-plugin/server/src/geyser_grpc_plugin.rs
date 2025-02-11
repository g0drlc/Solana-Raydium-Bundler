//! Implements the geyser plugin interface.

use std::{
    fs::File,
    io::Read,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    time::SystemTime,
};

use bs58;
use crossbeam_channel::{bounded, Sender, TrySendError};
use jito_geyser_protos::solana::{
    geyser::{
        geyser_server::GeyserServer, AccountUpdate, BlockUpdate, SlotUpdate, SlotUpdateStatus,
        TimestampedAccountUpdate, TimestampedBlockUpdate, TimestampedSlotUpdate,
        TimestampedTransactionUpdate, TransactionUpdate,
    },
    storage::confirmed_block::ConfirmedTransaction,
};
use log::*;
use serde_derive::Deserialize;
use serde_json;
use solana_geyser_plugin_interface::geyser_plugin_interface::{
    GeyserPlugin, GeyserPluginError, ReplicaAccountInfoVersions, ReplicaBlockInfoVersions,
    ReplicaTransactionInfoVersions, Result as PluginResult, SlotStatus,
};
use tokio::{runtime::Runtime, sync::oneshot};
use tonic::transport::Server;

use crate::server::{GeyserService, GeyserServiceConfig};

pub struct PluginData {
    runtime: Runtime,
    server_exit_sender: oneshot::Sender<()>,

    /// Where updates are piped thru to the grpc service.
    account_update_sender: Sender<TimestampedAccountUpdate>,
    slot_update_sender: Sender<TimestampedSlotUpdate>,
    block_update_sender: Sender<TimestampedBlockUpdate>,
    transaction_update_sender: Sender<TimestampedTransactionUpdate>,

    /// Highest slot that an account write has been processed for thus far.
    highest_write_slot: Arc<AtomicU64>,
}

#[derive(Default)]
pub struct GeyserGrpcPlugin {
    /// Initialized on initial plugin load.
    data: Option<PluginData>,
}

impl std::fmt::Debug for GeyserGrpcPlugin {
    fn fmt(&self, _: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Ok(())
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct PluginConfig {
    pub geyser_service_config: GeyserServiceConfig,
    pub bind_address: String,
    pub account_update_buffer_size: usize,
    pub slot_update_buffer_size: usize,
    pub block_update_buffer_size: usize,
    pub transaction_update_buffer_size: usize,
}

impl GeyserPlugin for GeyserGrpcPlugin {
    fn name(&self) -> &'static str {
        "geyser-grpc-plugin"
    }

    fn on_load(&mut self, config_path: &str) -> PluginResult<()> {
        solana_logger::setup_with_default("info");
        info!(
            "Loading plugin {:?} from config_path {:?}",
            self.name(),
            config_path
        );

        let mut file = File::open(config_path)?;
        let mut buf = String::new();
        file.read_to_string(&mut buf)?;

        let config: PluginConfig =
            serde_json::from_str(&buf).map_err(|err| GeyserPluginError::ConfigFileReadError {
                msg: format!("Error deserializing PluginConfig: {err:?}"),
            })?;

        let addr =
            config
                .bind_address
                .parse()
                .map_err(|err| GeyserPluginError::ConfigFileReadError {
                    msg: format!("Error parsing the bind_address {err:?}"),
                })?;

        let highest_write_slot = Arc::new(AtomicU64::new(0));
        let (account_update_sender, account_update_rx) = bounded(config.account_update_buffer_size);
        let (slot_update_sender, slot_update_rx) = bounded(config.slot_update_buffer_size);

        let (block_update_sender, block_update_receiver) = bounded(config.block_update_buffer_size);
        let (transaction_update_sender, transaction_update_receiver) =
            bounded(config.transaction_update_buffer_size);

        let svc = GeyserService::new(
            config.geyser_service_config,
            account_update_rx,
            slot_update_rx,
            block_update_receiver,
            transaction_update_receiver,
            highest_write_slot.clone(),
        );
        let svc = GeyserServer::new(svc);

        let runtime = Runtime::new().unwrap();
        let (server_exit_tx, server_exit_rx) = oneshot::channel();
        runtime.spawn(
            Server::builder()
                .add_service(svc)
                .serve_with_shutdown(addr, async move {
                    let _ = server_exit_rx.await;
                }),
        );

        self.data = Some(PluginData {
            runtime,
            server_exit_sender: server_exit_tx,
            account_update_sender,
            slot_update_sender,
            block_update_sender,
            transaction_update_sender,
            highest_write_slot,
        });
        info!("plugin data initialized");

        Ok(())
    }

    fn on_unload(&mut self) {
        info!("Unloading plugin: {:?}", self.name());

        let data = self.data.take().expect("plugin not initialized");
        data.server_exit_sender
            .send(())
            .expect("sending grpc server termination should succeed");
        data.runtime.shutdown_background();
    }

    fn update_account(
        &self,
        account: ReplicaAccountInfoVersions,
        slot: u64,
        is_startup: bool,
    ) -> PluginResult<()> {
        let data = self.data.as_ref().expect("plugin must be initialized");
        let account_update = match account {
            ReplicaAccountInfoVersions::V0_0_1(account) => TimestampedAccountUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                account_update: Some(AccountUpdate {
                    slot,
                    pubkey: account.pubkey.to_vec(),
                    lamports: account.lamports,
                    owner: account.owner.to_vec(),
                    is_executable: account.executable,
                    rent_epoch: account.rent_epoch,
                    data: account.data.to_vec(),
                    seq: account.write_version,
                    is_startup,
                    tx_signature: None,
                    replica_version: 1,
                }),
            },
            ReplicaAccountInfoVersions::V0_0_2(account) => {
                let tx_signature = account.txn_signature.map(|sig| sig.to_string());
                TimestampedAccountUpdate {
                    ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                    account_update: Some(AccountUpdate {
                        slot,
                        pubkey: account.pubkey.to_vec(),
                        lamports: account.lamports,
                        owner: account.owner.to_vec(),
                        is_executable: account.executable,
                        rent_epoch: account.rent_epoch,
                        data: account.data.to_vec(),
                        seq: account.write_version,
                        is_startup,
                        tx_signature,
                        replica_version: 2,
                    }),
                }
            }
            ReplicaAccountInfoVersions::V0_0_3(account) => TimestampedAccountUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                account_update: Some(AccountUpdate {
                    slot,
                    pubkey: account.pubkey.to_vec(),
                    lamports: account.lamports,
                    owner: account.owner.to_vec(),
                    is_executable: account.executable,
                    rent_epoch: account.rent_epoch,
                    data: account.data.to_vec(),
                    seq: account.write_version,
                    is_startup,
                    tx_signature: account.txn.map(|tx| tx.signature().to_string()),
                    replica_version: 2,
                }),
            },
        };

        let pubkey = &account_update.account_update.as_ref().unwrap().pubkey;
        let owner = &account_update.account_update.as_ref().unwrap().owner;

        if pubkey.len() != 32 {
            error!(
                "bad account pubkey length: {}",
                bs58::encode(pubkey).into_string()
            );
            return Ok(());
        }

        if owner.len() != 32 {
            error!(
                "bad account owner pubkey length: {}",
                bs58::encode(owner).into_string()
            );
            return Ok(());
        }

        data.highest_write_slot.fetch_max(slot, Ordering::SeqCst);

        debug!(
            "Streaming AccountUpdate {:?} with owner {:?} at slot {:?}",
            bs58::encode(&pubkey).into_string(),
            bs58::encode(&owner).into_string(),
            slot,
        );

        match data.account_update_sender.try_send(account_update) {
            Ok(_) => Ok(()),
            Err(TrySendError::Full(_)) => {
                warn!("account_update channel full, skipping");
                Ok(())
            }
            Err(TrySendError::Disconnected(_)) => {
                error!("account send error");
                Err(GeyserPluginError::AccountsUpdateError {
                    msg: "account_update channel disconnected, exiting".to_string(),
                })
            }
        }
    }

    fn notify_end_of_startup(&self) -> PluginResult<()> {
        Ok(())
    }

    fn update_slot_status(
        &self,
        slot: u64,
        parent_slot: Option<u64>,
        status: SlotStatus,
    ) -> PluginResult<()> {
        let data = self.data.as_ref().expect("plugin must be initialized");
        debug!("Updating slot {:?} at with status {:?}", slot, status);

        let status = match status {
            SlotStatus::Processed => SlotUpdateStatus::Processed,
            SlotStatus::Confirmed => SlotUpdateStatus::Confirmed,
            SlotStatus::Rooted => SlotUpdateStatus::Rooted,
        };

        match data.slot_update_sender.try_send(TimestampedSlotUpdate {
            ts: Some(prost_types::Timestamp::from(SystemTime::now())),
            slot_update: Some(SlotUpdate {
                slot,
                parent_slot,
                status: status as i32,
            }),
        }) {
            Ok(_) => Ok(()),
            Err(TrySendError::Full(_)) => {
                warn!("slot_update channel full, skipping");
                Ok(())
            }
            Err(TrySendError::Disconnected(_)) => {
                error!("slot send error");
                Err(GeyserPluginError::SlotStatusUpdateError {
                    msg: "slot_update channel disconnected, exiting".to_string(),
                })
            }
        }
    }

    fn notify_transaction(
        &self,
        transaction: ReplicaTransactionInfoVersions,
        slot: u64,
    ) -> PluginResult<()> {
        let data = self.data.as_ref().expect("plugin must be initialized");
        let transaction_update = match transaction {
            ReplicaTransactionInfoVersions::V0_0_1(tx) => TimestampedTransactionUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                transaction: Some(TransactionUpdate {
                    slot,
                    signature: tx.signature.to_string(),
                    is_vote: tx.is_vote,
                    tx_idx: u64::MAX,
                    tx: Some(ConfirmedTransaction {
                        transaction: Some(tx.transaction.to_versioned_transaction().into()),
                        meta: Some(tx.transaction_status_meta.clone().into()),
                    }),
                }),
            },
            ReplicaTransactionInfoVersions::V0_0_2(tx) => TimestampedTransactionUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                transaction: Some(TransactionUpdate {
                    slot,
                    signature: tx.signature.to_string(),
                    is_vote: tx.is_vote,
                    tx_idx: tx.index as u64,
                    tx: Some(ConfirmedTransaction {
                        transaction: Some(tx.transaction.to_versioned_transaction().into()),
                        meta: Some(tx.transaction_status_meta.clone().into()),
                    }),
                }),
            },
        };

        match data.transaction_update_sender.try_send(transaction_update) {
            Ok(_) => Ok(()),
            Err(TrySendError::Full(_)) => {
                warn!("transaction_update_sender full");
                Ok(())
            }
            Err(TrySendError::Disconnected(_)) => {
                error!("transaction_update_sender disconnected");
                Err(GeyserPluginError::TransactionUpdateError {
                    msg: "transaction_update_sender channel disconnected, exiting".to_string(),
                })
            }
        }
    }

    fn notify_block_metadata(&self, block_info: ReplicaBlockInfoVersions) -> PluginResult<()> {
        let data = self.data.as_ref().expect("plugin must be initialized");

        let block = match block_info {
            ReplicaBlockInfoVersions::V0_0_1(block) => TimestampedBlockUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                block_update: Some(BlockUpdate {
                    slot: block.slot,
                    blockhash: block.blockhash.to_string(),
                    rewards: block.rewards.iter().map(|r| (*r).clone().into()).collect(),
                    block_time: block.block_time.map(|t| prost_types::Timestamp {
                        seconds: t,
                        nanos: 0,
                    }),
                    block_height: block.block_height,
                    executed_transaction_count: None,
                    entry_count: None,
                }),
            },
            ReplicaBlockInfoVersions::V0_0_2(block) => TimestampedBlockUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                block_update: Some(BlockUpdate {
                    slot: block.slot,
                    blockhash: block.blockhash.to_string(),
                    rewards: block.rewards.iter().map(|r| (*r).clone().into()).collect(),
                    block_time: block.block_time.map(|t| prost_types::Timestamp {
                        seconds: t,
                        nanos: 0,
                    }),
                    block_height: block.block_height,
                    executed_transaction_count: Some(block.executed_transaction_count),
                    entry_count: None,
                }),
            },
            ReplicaBlockInfoVersions::V0_0_3(block) => TimestampedBlockUpdate {
                ts: Some(prost_types::Timestamp::from(SystemTime::now())),
                block_update: Some(BlockUpdate {
                    slot: block.slot,
                    blockhash: block.blockhash.to_string(),
                    rewards: block.rewards.iter().map(|r| (*r).clone().into()).collect(),
                    block_time: block.block_time.map(|t| prost_types::Timestamp {
                        seconds: t,
                        nanos: 0,
                    }),
                    block_height: block.block_height,
                    executed_transaction_count: Some(block.executed_transaction_count),
                    entry_count: Some(block.entry_count),
                }),
            },
        };
        match data.block_update_sender.try_send(block) {
            Ok(_) => Ok(()),
            Err(TrySendError::Full(_)) => {
                warn!("block update sender full");
                Ok(())
            }
            Err(TrySendError::Disconnected(_)) => {
                error!("block update send disconnected");
                Err(GeyserPluginError::Custom(
                    Box::try_from("block_update_sender channel disconnected, exiting".to_string())
                        .unwrap(),
                ))
            }
        }
    }

    fn account_data_notifications_enabled(&self) -> bool {
        true
    }

    fn transaction_notifications_enabled(&self) -> bool {
        true
    }
}

#[no_mangle]
#[allow(improper_ctypes_definitions)]
/// # Safety
///
/// This function returns the Plugin pointer as trait GeyserPlugin.
pub unsafe extern "C" fn _create_plugin() -> *mut dyn GeyserPlugin {
    let plugin = GeyserGrpcPlugin::default();
    let plugin: Box<dyn GeyserPlugin> = Box::new(plugin);
    Box::into_raw(plugin)
}
