import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Trade } from '../models/trade.model';

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
}
