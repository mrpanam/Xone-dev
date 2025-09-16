import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _categories = new BehaviorSubject<Category[]>([]);
  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  // Public observables
  categories$ = this._categories.asObservable();
  loading$ = this._loading.asObservable();
  error$ = this._error.asObservable();

  // Get current value of categories
  get categories(): Category[] {
    return [...this._categories.value];
  }

  // Load all categories
  async loadCategories(forceRefresh = false): Promise<void> {
    if (this._loading.value) return;
    
    this._loading.next(true);
    this._error.next(null);

    try {
      const categories = await invoke<Category[]>('get_types');
      this._categories.next(categories);
    } catch (error) {
      const errorMessage = `Failed to load categories: ${error}`;
      this._error.next(errorMessage);      
      throw new Error(errorMessage);
    } finally {
      this._loading.next(false);
    }
  }

  // Get category by ID
  getCategoryById(id: string): Category | undefined {
    return this._categories.value.find(cat => cat.id?.id.String === id);
  }

  // Update a category
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    if (this._loading.value) return;
    
    this._loading.next(true);
    this._error.next(null);

    try {
      // Remove the id from updates if it exists to avoid conflicts
      const { id: _, ...updateData } = updates as any;
      
      const updatedCategory = await invoke<Category>('update_type', { 
        id, 
        updates: updateData 
      });
      
      const categories = this._categories.value.map(cat => 
        cat.id?.id.String === id ? { ...cat, ...updatedCategory } : cat
      );
      
      this._categories.next(categories);
    } catch (error) {
      console.error('Update category error:', error);
      const errorMessage = `Failed to update category: ${error}`;
      this._error.next(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this._loading.next(false);
    }
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    if (this._loading.value) return;
    
    this._loading.next(true);
    this._error.next(null);

    try {
      await invoke('delete_category', { id });
      // Remove the category from the local state
      this._categories.next(this._categories.value.filter(cat => cat.id?.id.String !== id));
    } catch (error) {
      const errorMessage = `Failed to delete category: ${error}`;
      this._error.next(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this._loading.next(false);
    }
  }

  // Refresh categories
  async refreshCategories(): Promise<void> {
    return this.loadCategories(true);
  }

  // Create a new category
  async createCategory(category: Category): Promise<void> {
    try {
      if (!category.id) {
        throw new Error('Category ID is required');
      }
      
      await invoke('create_category', { 
        id: category.id.id.String,
        name: category.name,
        description: category.description 
      });
      await this.refreshCategories();
    } catch (error) {
      const errorMessage = `Failed to create category: ${error}`;
      this._error.next(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
