mod db;
mod model;
mod category;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize database connection before starting Tauri
    let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");

    match rt.block_on(db::init()) {
        Ok(_db) => {}
        Err(_) => {
            std::process::exit(1);
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db::get_types,
            db::get_trades,
            category::create_category
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
