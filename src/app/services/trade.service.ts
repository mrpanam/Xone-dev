import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Category } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _categories: Category[] = [];
  loading = false;
  error: string | null = null;

  get categories(): Category[] {
    return [...this._categories];
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
}
