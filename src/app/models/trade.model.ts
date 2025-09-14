export interface Category {
  id?: SurrealId;
  name: string;
  description: string;
}


  export interface SurrealId {
  tb: string;
  id: {
    String: string;
  };
}

export interface Trade {
  id?: SurrealId;
  symbol: string;
  category: SurrealId;
  categoryName?: string; // Added for display purposes
  status: string;
  quantity: number;
  bought_price: number;
  current_price: number;
  timestamp: string;
}

// Removed RecordId as it's no longer needed
    