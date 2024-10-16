use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, QuerySelect, Set,
};
use solana_client::nonblocking::rpc_client::RpcClient;
use std::collections::HashSet;
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
    db: &DatabaseConnection,
    program_id: &str,
) -> Result<Option<ProcessedTransactionModel>, Box<dyn Error>> {
    println!("Fetching latest transaction for program: {}", program_id);
    let latest_transaction = ProcessedTransactions::find()
        .filter(ProcessedTransactionColumn::ProgramId.eq(program_id))
        .order_by_desc(ProcessedTransactionColumn::BlockTime)
        .one(db)
        .await?;

    match &latest_transaction {
        Some(tx) => println!("Latest transaction found: {}", tx.transaction_id),
        None => println!("No transactions found for the program"),
    }

    Ok(latest_transaction)
}

// Function to get and process pump fun transactions
pub async fn fetch_txs(
    rpc_client: &RpcClient,
    db: &DatabaseConnection,
) -> Result<(), Box<dyn Error>> {
    println!("Starting to fetch pump fun transactions...");

    // Get all pump fun transactions
    let sigs = get_all_signatures_for_address(rpc_client, &pump_fun::ID, None).await?;

    // Log the number of transactions fetched
    println!("Fetched {} pump fun transactions", sigs.len());

    // Get existing transaction IDs from the database
    let existing_txs: Vec<String> = ProcessedTransactions::find()
        .select_only()
        .column(ProcessedTransactionColumn::TransactionId)
        .into_tuple()
        .all(db)
        .await?;

    let existing_tx_set: HashSet<String> = existing_txs.into_iter().collect();

    // Filter out existing transactions
    let new_transactions: Vec<ProcessedTransactionActiveModel> = sigs
        .iter()
        .filter(|sig| !existing_tx_set.contains(&sig.signature.to_string()))
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

    println!(
        "Found {} new transactions to insert",
        new_transactions.len()
    );

    // Define the batch size
    const BATCH_SIZE: usize = 1000;

    println!("Preparing to insert new transactions into the database...");

    // Process transactions in batches
    let total_batches = (new_transactions.len() + BATCH_SIZE - 1) / BATCH_SIZE;
    for (i, chunk) in new_transactions.chunks(BATCH_SIZE).enumerate() {
        let batch: Vec<ProcessedTransactionActiveModel> = chunk.to_vec();
        println!(
            "Inserting batch {} of {} (size: {})",
            i + 1,
            total_batches,
            batch.len()
        );
        // Insert the batch of transactions
        ProcessedTransactions::insert_many(batch).exec(db).await?;
        println!("Batch {} inserted successfully", i + 1);
    }

    println!("All new transactions have been inserted into the database.");
    Ok(())
}
