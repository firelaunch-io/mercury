mod consts;
mod magic;

use dotenv::dotenv;
use sea_orm::{Database, DbErr};

use magic::Env;

#[tokio::main]
async fn main() -> Result<(), DbErr> {
    dotenv().ok();
    let database_url = Env::get_pg_connection_name();
    println!("Database URL: {}", database_url);
    let _db = Database::connect(&database_url).await?;
    println!("Connected to the database successfully!");

    // Your application logic here

    Ok(())
}
