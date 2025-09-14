
use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use crate::model;

pub async fn init() -> surrealdb::Result<Surreal<Client>> {
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

    Ok(db)
}

#[tauri::command]
pub async fn get_types() -> Result<Vec<model::Category>, String> {
    match init().await {
        Ok(db) => {
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
        Err(e) => Err(format!("Database connection failed: {}", e)),
    }
}
