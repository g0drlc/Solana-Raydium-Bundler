//! Contains application specific representations of proto definitions.

use jito_geyser_protos::solana::geyser;
use solana_sdk::{pubkey::Pubkey, slot_hashes::Slot};

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum SlotStatus {
    Rooted,
    Confirmed,
    Processed,
}

pub(crate) trait AccountUpdateNotification {
    fn pubkey(&self) -> Pubkey;
    fn set_seq(&mut self, seq: u64);
    fn seq(&self) -> u64;
    fn slot(&self) -> Slot;
}

pub struct AccountUpdate {
    pub pubkey: Pubkey,
    pub owner: Pubkey,
    pub data: Vec<u8>,
    pub tx_signature: Option<String>,
    pub slot: Slot,
    pub lamports: u64,
    pub rent_epoch: u64,
    pub seq: u64,
    pub replica_version: u32,
    pub is_executable: bool,
    pub is_startup: bool,
}

impl AccountUpdateNotification for AccountUpdate {
    fn pubkey(&self) -> Pubkey {
        self.pubkey
    }
    fn set_seq(&mut self, seq: u64) {
        self.seq = seq;
    }
    fn seq(&self) -> u64 {
        self.seq
    }
    fn slot(&self) -> Slot {
        self.slot
    }
}

impl From<geyser::AccountUpdate> for AccountUpdate {
    fn from(proto: geyser::AccountUpdate) -> Self {
        let pubkey = Pubkey::try_from(proto.pubkey).unwrap();
        let owner = Pubkey::try_from(proto.owner).unwrap();

        Self {
            pubkey,
            owner,
            data: proto.data,
            tx_signature: proto.tx_signature,
            slot: proto.slot,
            lamports: proto.lamports,
            rent_epoch: proto.rent_epoch,
            seq: proto.seq,
            is_executable: proto.is_executable,
            is_startup: proto.is_startup,
            replica_version: proto.replica_version,
        }
    }
}

pub struct PartialAccountUpdate {
    pub pubkey: Pubkey,
    pub tx_signature: Option<String>,
    pub slot: Slot,
    pub seq: u64,
    pub is_startup: bool,
}

impl AccountUpdateNotification for PartialAccountUpdate {
    fn pubkey(&self) -> Pubkey {
        self.pubkey
    }
    fn set_seq(&mut self, seq: u64) {
        self.seq = seq;
    }
    fn seq(&self) -> u64 {
        self.seq
    }
    fn slot(&self) -> Slot {
        self.slot
    }
}

impl From<geyser::PartialAccountUpdate> for PartialAccountUpdate {
    fn from(proto: geyser::PartialAccountUpdate) -> Self {
        let pubkey = Pubkey::try_from(proto.pubkey).unwrap();

        Self {
            pubkey,
            tx_signature: proto.tx_signature,
            slot: proto.slot,
            seq: proto.seq,
            is_startup: proto.is_startup,
        }
    }
}

pub enum SlotUpdateStatus {
    Confirmed,
    Processed,
    Rooted,
}

impl From<geyser::SlotUpdateStatus> for SlotUpdateStatus {
    fn from(proto: geyser::SlotUpdateStatus) -> Self {
        match proto {
            geyser::SlotUpdateStatus::Confirmed => Self::Confirmed,
            geyser::SlotUpdateStatus::Processed => Self::Processed,
            geyser::SlotUpdateStatus::Rooted => Self::Rooted,
        }
    }
}

pub struct SlotUpdate {
    pub parent_slot: Option<Slot>,
    pub slot: Slot,
    pub status: SlotUpdateStatus,
}

impl From<geyser::SlotUpdate> for SlotUpdate {
    fn from(proto: geyser::SlotUpdate) -> Self {
        let status = geyser::SlotUpdateStatus::try_from(proto.status).unwrap();
        Self {
            parent_slot: proto.parent_slot,
            slot: proto.slot,
            status: SlotUpdateStatus::from(status),
        }
    }
}
