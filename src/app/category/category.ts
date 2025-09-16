import { Component, ViewChild, ElementRef } from '@angular/core';
import { JsonPipe, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category, SurrealId } from '../models/trade.model';

declare const bootstrap: any;

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
  categoryToDelete: { id: string; name: string } | null = null;
  categoryToEdit: Category | null = null;
  editing = false;
  deleting = false;
  @ViewChild('deleteModal') deleteModal!: ElementRef;

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
    this.editing = false;
    this.categoryToEdit = null;
    this.categoryForm.reset();
  }

  editCategory(category: Category) {
    this.categoryToEdit = category;
    this.editing = true;
    this.showAddForm = true;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  // Handle category deletion
  openDeleteModal(category: Category) {
    if (!category.id?.id?.String) return;
    
    this.categoryToDelete = {
      id: category.id.id.String,
      name: category.name
    };
    
    const modal = new bootstrap.Modal(this.deleteModal.nativeElement);
    modal.show();
  }

  async confirmDelete() {
    if (!this.categoryToDelete) return;
    
    this.deleting = true;
    try {
      await this.categoryService.deleteCategory(this.categoryToDelete.id);
      this.categoryForm.reset();
      await this.categoryService.loadCategories();
    } finally {
      this.deleting = false;
      this.categoryToDelete = null;
    }
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      const { name, description } = this.categoryForm.value;
      
      if (this.editing && this.categoryToEdit?.id?.id.String) {
        // Update existing category
        await this.categoryService.updateCategory(this.categoryToEdit.id.id.String, {
          name,
          description
        });
      } else {
        // Create new category
        const surrealid: SurrealId = {
          tb: 'category',
          id: { String: name.toLowerCase() }
        };   
        const category: Category = {
          id: surrealid,
          name,
          description
        };
        await this.categoryService.createCategory(category);
      }
      
      this.toggleAddForm();
      await this.categoryService.refreshCategories();
    }
  }

  async refreshCategories() {
    await this.categoryService.refreshCategories();
  }
}
