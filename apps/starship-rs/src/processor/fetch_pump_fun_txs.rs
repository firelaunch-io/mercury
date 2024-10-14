use sea_orm::ColumnTrait;
use sea_orm::{EntityTrait, QueryFilter, QueryOrder, Set};
use solana_client::nonblocking::rpc_client::RpcClient;
use std::error::Error;

use crate::{
    consts::STARSHIP_VERSION,
    entities::{
        prelude::*,
        processed_transactions::{
            ActiveModel as ProcessedTransactionActiveModel, Column as ProcessedTransactionColumn,
            Model as ProcessedTransactionModel,
        },
        sea_orm_active_enums::ProcessStatus,
    },
    magic::get_all_signatures_for_address,
    pump_fun,
};

// Function to get the latest transaction for a program
#[allow(dead_code)]
pub async fn db_latest_transaction_for_program(
    db: &sea_orm::DatabaseConnection,
    program_id: &str,
) -> Result<Option<ProcessedTransactionModel>, Box<dyn Error>> {
    let latest_transaction = ProcessedTransactions::find()
        .filter(ProcessedTransactionColumn::ProgramId.eq(program_id))
        .order_by_desc(ProcessedTransactionColumn::BlockTime)
        .one(db)
        .await?;

    Ok(latest_transaction)
}

// Function to get and process pump fun transactions
pub async fn fetch_pump_fun_txs(
    rpc_client: &RpcClient,
    db: &sea_orm::DatabaseConnection,
) -> Result<(), Box<dyn Error>> {
    // Get all pump fun transactions
    let sigs = get_all_signatures_for_address(rpc_client, &pump_fun::ID, None).await?;

    // Log the number of transactions fetched
    println!("Fetched {} pump fun transactions", sigs.len());

    // Insert all transactions to process on the database so we don't have to query the blockchain next time.
    let transactions: Vec<ProcessedTransactionActiveModel> = sigs
        .iter()
        .map(|sig| ProcessedTransactionActiveModel {
            transaction_id: Set(sig.signature.to_string()),
            program_id: Set(pump_fun::ID.to_string()),
            transaction_type: Set("Unknown".to_string()), // You might want to determine the type based on the transaction data
            starship_version: Set(STARSHIP_VERSION.to_string()),
            external_version: Set("0.1.0".to_string()), // You might want to get this from somewhere else
            process_status: Set(ProcessStatus::Pending),
            retries: Set(0),
            processed_at: Set(None),
            block_time: Set(sig.block_time),
        })
        .collect();

    // Define the batch size
    const BATCH_SIZE: usize = 1000;

    // Process transactions in batches
    for chunk in transactions.chunks(BATCH_SIZE) {
        let batch: Vec<ProcessedTransactionActiveModel> = chunk.to_vec();
        // Insert the batch of transactions
        ProcessedTransactions::insert_many(batch).exec(db).await?;
    }

    Ok(())
}
