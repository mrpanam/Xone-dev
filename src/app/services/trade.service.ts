import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Category, Trade } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _categories: Category[] = [];
  private _trades: Trade[] = [];
  loading = false;
  tradesLoading = false;
  error: string | null = null;
  tradesError: string | null = null;

  get categories(): Category[] {
    return [...this._categories];
  }

  get trades(): Trade[] {
    return [...this._trades];
  }

  async loadCategories(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this._categories = await invoke<Category[]>('get_types');
      console.log('Categories loaded:', this._categories);
    } catch (error) {
      this.error = `Failed to load categories: ${error}`;
      console.error('Error loading categories:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async refreshCategories(): Promise<void> {
    await this.loadCategories();
  }

  async loadTrades(): Promise<void> {
    this.tradesLoading = true;
    this.tradesError = null;

    try {
      // First load categories to get the names
      await this.loadCategories();
      
      // Then load trades
      this._trades = await invoke<Trade[]>('get_trades');
      console.log('Trades loaded:', this._trades);
      
      // Map category names to trades
      this._trades = this._trades.map(trade => ({
        ...trade,
        categoryName: this._categories.find(cat => 
          cat.id?.id.String === trade.category.id.String && 
          cat.id?.tb === trade.category.tb
        )?.name || trade.category.id.String
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
