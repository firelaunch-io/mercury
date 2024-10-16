use sea_orm::{ActiveModelTrait, DatabaseConnection};
use solana_client::{nonblocking::rpc_client::RpcClient, rpc_config::RpcTransactionConfig};
use solana_sdk::signature::Signature;
use solana_transaction_status::UiTransactionEncoding;

use crate::entities::{
    prelude::*,
    processed_transactions::{
        ActiveModel as ProcessedTransactionActiveModel, Column as ProcessedTransactionColumn,
        Model as ProcessedTransactionModel,
    },
};

use crate::entities::sea_orm_active_enums::ProcessStatus;
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter};
use std::{error::Error, str::FromStr};

async fn read_pending_or_failed_transactions(
    db: &DatabaseConnection,
) -> Result<Vec<ProcessedTransactionModel>, Box<dyn Error>> {
    // Query the database for all transactions with Pending or Failed status
    let transactions = ProcessedTransactions::find()
        .filter(
            Condition::any()
                .add(ProcessedTransactionColumn::ProcessStatus.eq(ProcessStatus::Pending))
                .add(ProcessedTransactionColumn::ProcessStatus.eq(ProcessStatus::Failed)),
        )
        .all(db)
        .await?;

    println!(
        "Found {} pending or failed transactions",
        transactions.len()
    );

    Ok(transactions)
}

pub async fn process_txs(
    rpc_client: &RpcClient,
    db: &DatabaseConnection,
) -> Result<(), Box<dyn Error>> {
    for transaction in read_pending_or_failed_transactions(db).await? {
        println!("Processing transaction: {}", transaction.transaction_id);
        process_tx(rpc_client, db, &transaction).await?;
    }
    Ok(())
}

pub async fn process_tx(
    rpc_client: &RpcClient,
    db: &DatabaseConnection,
    db_tx: &ProcessedTransactionModel,
) -> Result<(), Box<dyn Error>> {
    let sig = Signature::from_str(db_tx.transaction_id.as_str())?;
    let cfg = RpcTransactionConfig {
        encoding: Some(UiTransactionEncoding::JsonParsed),
        max_supported_transaction_version: Some(0),
        ..Default::default()
    };

    let tx = rpc_client.get_transaction_with_config(&sig, cfg).await?;
    println!("{:?}", tx);

    Ok(())
}
