use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use crate::model;
use crate::db::Db;

#[derive(Debug, Serialize, Deserialize)]
struct CreateCategory {
    name: String,
    description: String,
}

#[tauri::command]
pub async fn create_category(
    db: tauri::State<'_, Db>,
    id: String, 
    name: String, 
    description: String
) -> Result<model::Category, String> {
    let db = db.lock().await;
    
    // Create a new category with the specified ID
    let category: Option<model::Category> = db
        .create(("category", &id))
        .content(CreateCategory { name, description })
        .await
        .map_err(|e| e.to_string())?;

    match category {
        Some(cat) => {
            println!("Created category: {:?}", cat);
            Ok(cat)
        }
        None => Err("Failed to create category".to_string()),
    }
}

#[tauri::command]
pub async fn update_type(
    db: tauri::State<'_, Db>,
    id: String, 
    updates: std::collections::HashMap<String, Value>
) -> Result<model::Category, String> {
    let db = db.lock().await;
    
    // Convert the updates HashMap to a serde_json::Value
    let updates_value = serde_json::to_value(updates)
        .map_err(|e| format!("Failed to serialize updates: {}", e))?;
    
    // Use the update API with merge
    let category: Option<model::Category> = db
        .update(("category", id.as_str()))
        .merge(updates_value)
        .await
        .map_err(|e| format!("Failed to update category: {}", e))?;
    
    match category {
        Some(cat) => {
            println!("Updated category: {:?}", cat);
            Ok(cat)
        }
        None => Err("Failed to update category: not found".to_string()),
    }
}

#[tauri::command]
pub async fn delete_category(
    db: tauri::State<'_, Db>,
    id: String
) -> Result<(), String> {
    let db = db.lock().await;
    
    // Delete the category using the (table, id) tuple syntax
    let _: Option<model::Category> = db.delete(("category", id.as_str()))
        .await
        .map_err(|e| e.to_string())?;
    
    println!("Deleted category with ID: {}", id);
    Ok(())
}