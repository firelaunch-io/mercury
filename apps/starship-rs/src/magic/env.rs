use crate::consts::{PG_CONNECTION_NAME, SOLANA_RPC_URL};

/// Get the value of the environment variable
#[macro_export]
macro_rules! env_var {
    ($key:expr) => {
        std::env::var($key).expect(&format!("{} must be set in .env file", $key))
    };
}

pub struct Env;

impl Env {
    pub fn get_pg_connection_name() -> String {
        env_var!(PG_CONNECTION_NAME)
    }
    pub fn get_solana_rpc_url() -> String {
        env_var!(SOLANA_RPC_URL)
    }
}
