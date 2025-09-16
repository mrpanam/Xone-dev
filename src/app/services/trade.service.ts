import { Injectable } from '@angular/core';
import { Trade } from '../models/trade.model';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _trades: Trade[] = [];
  tradesLoading = false;
  tradesError: string | null = null;

  get trades(): Trade[] {
    return [...this._trades];
  }

  constructor() {}

  async loadTrades(): Promise<void> {
    this.tradesLoading = true;
    this.tradesError = null;

    try {
      // Load trades
      this._trades = await invoke<Trade[]>('get_trades');
    } catch (error) {
      this.tradesError = `Failed to load trades: ${error}`;      
      throw error;
    } finally {
      this.tradesLoading = false;
    }
  }

  async refreshTrades(): Promise<void> {
    await this.loadTrades();
  }

  getProfitLoss(trade: Trade): number {
    return (trade.current_price - trade.bought_price) * trade.quantity;
  }

  getTotalPnL(): number {
    if (!this._trades || this._trades.length === 0) return 0;
    return this._trades.reduce((total, trade) => {
      return total + this.getProfitLoss(trade);
    }, 0);
  }

  sortTrades(field: string, direction: 'asc' | 'desc'): void {
    if (!this._trades || this._trades.length === 0) return;

    this._trades.sort((a: any, b: any) => {
      let valueA, valueB;

      switch (field) {
        case 'category':
          valueA = (a.categoryName || a.category?.id?.String || '').toLowerCase();
          valueB = (b.categoryName || b.category?.id?.String || '').toLowerCase();
          break;
        case 'status':
          valueA = (a.status || '').toLowerCase();
          valueB = (b.status || '').toLowerCase();
          break;
        default:
          return 0;
      }

      // Handle undefined/null values
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      // Compare values
      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      // Apply sort direction
      return direction === 'asc' ? comparison : -comparison;
    });

    // Create a new array reference to trigger change detection
    this._trades = [...this._trades];
  }
}
