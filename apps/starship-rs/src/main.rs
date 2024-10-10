mod consts;
mod magic;

use dotenvy::dotenv;
use sea_orm::{Database, DbErr};
use solana_client::rpc_client::RpcClient;

use magic::Env;

anchor_lang::declare_program!(pump_fun);

#[tokio::main]
async fn main() -> Result<(), DbErr> {
    dotenv().ok();
    let database_url = Env::get_pg_connection_name();
    let db = Database::connect(&database_url).await?;
    let rpc_url = Env::get_solana_rpc_url();
    let client = RpcClient::new(rpc_url);
    Ok(())
}
