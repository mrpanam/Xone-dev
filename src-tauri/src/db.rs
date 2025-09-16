
use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::model;

// Type alias for the database connection
pub type Db = Arc<Mutex<Surreal<Client>>>;

pub async fn init() -> surrealdb::Result<Db> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    // Sign in as root user (in production, use proper authentication)
    db.signin(Root {
        username: "root",
        password: "root",
    })
    .await?;

    // Select a specific namespace / database
    db.use_ns("eric").use_db("Trading").await?;

    Ok(Arc::new(Mutex::new(db)))
}

#[tauri::command]
pub async fn get_types(db: tauri::State<'_, Db>) -> Result<Vec<model::Category>, String> {
    let db = db.lock().await;
    match db.select::<Vec<model::Category>>("category").await {
                Ok(types) => {
                    // Print categories as JSON
                    if let Ok(json) = serde_json::to_string_pretty(&types) {
                        println!("Categories as JSON:\n{}", json);
                    }
                    Ok(types)
                }
                Err(e) => Err(format!("Database query failed: {}", e)),
            }
}

#[tauri::command]
pub async fn get_trades(db: tauri::State<'_, Db>) -> Result<Vec<model::Trade>, String> {
    let db = db.lock().await;
    match db.select::<Vec<model::Trade>>("trade").await {
                Ok(trades) => {
                    // Print trades as JSON
                    if let Ok(json) = serde_json::to_string_pretty(&trades) {
                        println!("Trades as JSON:\n{}", json);
                    }
                    Ok(trades)
                }
                Err(e) => Err(format!("Database query failed: {}", e)),
            }
}
    
