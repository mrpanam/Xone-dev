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

  getTotalPnL(): number {
    if (!this._trades || this._trades.length === 0) return 0;
    return this._trades.reduce((total, trade) => {
      return total + ((trade.current_price - trade.bought_price) * trade.quantity);
    }, 0);
  }
}
