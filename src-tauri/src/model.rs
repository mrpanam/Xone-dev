use serde::{Deserialize, Serialize};
use surrealdb::RecordId;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: Option<RecordId>,
    pub name: String,
    pub description: String,
}
