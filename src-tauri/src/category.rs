use serde::{Deserialize, Serialize};
use crate::model;
use crate::db::init;

#[derive(Debug, Serialize, Deserialize)]
struct CreateCategory {
    name: String,
    description: String,
}

#[tauri::command]
pub async fn create_category(id: String, name: String, description: String) -> Result<model::Category, String> {
    let db = init().await.map_err(|e| e.to_string())?;
    
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
pub async fn delete_category(id: String) -> Result<(), String> {
    let db = init().await.map_err(|e| e.to_string())?;
    
    // Delete the category using the (table, id) tuple syntax
    let _: Option<model::Category> = db.delete(("category", id.as_str()))
        .await
        .map_err(|e| e.to_string())?;
    
    println!("Deleted category with ID: {}", id);
    Ok(())
}