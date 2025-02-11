pub mod geyser_grpc_plugin;
pub mod server;
pub(crate) mod subscription_stream;

#[cfg(not(feature = "jito-solana"))]
extern crate solana_geyser_plugin_interface;
#[cfg(not(feature = "jito-solana"))]
extern crate solana_logger;
#[cfg(not(feature = "jito-solana"))]
extern crate solana_metrics;
#[cfg(not(feature = "jito-solana"))]
extern crate solana_program;
#[cfg(not(feature = "jito-solana"))]
extern crate solana_sdk;
#[cfg(not(feature = "jito-solana"))]
extern crate solana_vote_program;

#[cfg(feature = "jito-solana")]
extern crate jito_solana_geyser_plugin_interface as solana_geyser_plugin_interface;
#[cfg(feature = "jito-solana")]
extern crate jito_solana_logger as solana_logger;
#[cfg(feature = "jito-solana")]
extern crate jito_solana_metrics as solana_metrics;
#[cfg(feature = "jito-solana")]
extern crate jito_solana_program as solana_program;
#[cfg(feature = "jito-solana")]
extern crate jito_solana_sdk as solana_sdk;
#[cfg(feature = "jito-solana")]
extern crate jito_solana_vote_program as solana_vote_program;
