import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Trade } from '../models/trade.model';
import { CategoryService } from './category.service';

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

  constructor(private categoryService: CategoryService) {}

  async loadTrades(forceRefresh = false): Promise<void> {
    this.tradesLoading = true;
    this.tradesError = null;

    try {
      // First ensure categories are loaded
      await this.categoryService.loadCategories(forceRefresh);
      
      // Then load trades
      const trades = await invoke<Trade[]>('get_trades');
      console.log('Trades loaded:', trades);
      
      // Map category names to trades
      this._trades = trades.map(trade => ({
        ...trade,
        categoryName: this.categoryService.getCategoryName(trade.category)
      }));
    } catch (error) {
      this.tradesError = `Failed to load trades: ${error}`;
      console.error('Error loading trades:', error);
      throw error;
    } finally {
      this.tradesLoading = false;
    }
  }

  async refreshTrades(): Promise<void> {
    await this.loadTrades();
  }
}
