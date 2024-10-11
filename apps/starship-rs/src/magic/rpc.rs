use std::{error::Error, str::FromStr};

use solana_client::{
    nonblocking::rpc_client::RpcClient, rpc_client::GetConfirmedSignaturesForAddress2Config, rpc_response::RpcConfirmedTransactionStatusWithSignature
};
use solana_sdk::{pubkey::Pubkey, signature::Signature};

pub async fn get_all_signatures_for_address(
    client: &RpcClient,
    address: &Pubkey,
    start_from_signature: Option<Signature>,
) -> Result<Vec<RpcConfirmedTransactionStatusWithSignature>, Box<dyn Error>> {
    let mut all_signatures = Vec::new();
    let mut last_signature = start_from_signature;
    const LIMIT: usize = 1000;

    loop {
        let cfg = GetConfirmedSignaturesForAddress2Config {
            commitment: None,
            before: last_signature,
            until: None,
            limit: Some(LIMIT),
        };
        let signatures = client
            .get_signatures_for_address_with_config(address, cfg)
            .await?;

        if signatures.is_empty() {
            break;
        }

        all_signatures.extend(signatures.iter().cloned());
        last_signature = signatures
            .last()
            .map(|s| Signature::from_str(&s.signature).unwrap());

        if signatures.len() < LIMIT {
            break;
        }
    }

    Ok(all_signatures)
}
