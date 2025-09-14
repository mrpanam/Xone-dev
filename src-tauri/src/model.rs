use serde::{Deserialize, Serialize};
use surrealdb::{RecordId, sql::Datetime};


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: Option<RecordId>,
    pub name: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trade {
    pub id: Option<RecordId>,
    pub symbol: String,    
    pub category: RecordId,
    pub status: String,
    pub quantity: f32,
    pub bought_price: f32,
    pub current_price: f32,
    pub timestamp: Datetime,
  
}

