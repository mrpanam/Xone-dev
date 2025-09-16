mod db;
mod model;
mod category;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Create the Tokio runtime
    let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
    
    // Initialize the database connection
    let db = match rt.block_on(db::init()) {
        Ok(db) => db,
        Err(e) => {
            eprintln!("Failed to initialize database: {}", e);
            std::process::exit(1);
        }
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db) // Make the database available to commands
        .invoke_handler(tauri::generate_handler![
            db::get_types,
            db::get_trades,
            category::create_category,
            category::update_type,
            category::delete_category
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
