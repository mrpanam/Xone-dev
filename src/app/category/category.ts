import { Component } from '@angular/core';
import { JsonPipe, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category, SurrealId } from '../models/trade.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, ReactiveFormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class CategoryComponent {
  showAddForm = false;
  categoryForm: FormGroup;

  constructor(
    public categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.categoryService.loadCategories();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.categoryForm.reset();
    }
  }

  // Handle category deletion
  async deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await this.categoryService.deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
        // Error is already handled by the service
      }
    }
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      const { name, description } = this.categoryForm.value;  
      const surrealid : SurrealId = {
        tb: 'category',
        id: { String: name.toLowerCase() }
      };   
      const category: Category = {
        id: surrealid,
        name,
        description
      };
      await this.categoryService.createCategory(category);
      this.toggleAddForm();
      await this.categoryService.refreshCategories();
    }
  }

  async refreshCategories() {
    await this.categoryService.refreshCategories();
  }
}
