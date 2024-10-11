mod consts;
mod entities;
mod magic;
mod processor;

use std::error::Error;
use clap::{Parser, Subcommand};
use dotenvy::dotenv;
use processor::fetch_pump_fun_txs::fetch_pump_fun_txs;
use sea_orm::Database;
use solana_client::nonblocking::rpc_client::RpcClient;

use magic::Env;

anchor_lang::declare_program!(pump_fun);

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Fetch pump fun txs
    FetchPumpFunTransactions,
    /// Process pump fun txs
    ProcessPumpFunTransactions,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();
    let cli = Cli::parse();

    let db = Database::connect(Env::get_pg_connection_name()).await?;
    let rpc_client = RpcClient::new(Env::get_solana_rpc_url());

    match &cli.command {
        Some(Commands::FetchPumpFunTransactions) => {
            let inserted_count = fetch_pump_fun_txs(&rpc_client, &db).await?;
            println!("Fetched and inserted {} transactions", inserted_count);
        }
        Some(Commands::ProcessPumpFunTransactions) => {
            println!("Processing pump fun transactions...");
            // TODO: Implement processing logic
        }
        None => {
            println!("No command specified. Use --help for usage information.");
        }
    }

    Ok(())
}
