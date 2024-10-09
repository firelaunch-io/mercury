use crate::consts::PG_CONNECTION_NAME;

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
}
