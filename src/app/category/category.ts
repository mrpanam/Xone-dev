import { Component } from '@angular/core';
import { JsonPipe, AsyncPipe } from '@angular/common';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class CategoryComponent {
  constructor(public categoryService: CategoryService) {}

  async ngOnInit() {
    await this.categoryService.loadCategories();
  }

  async refreshCategories() {
    await this.categoryService.refreshCategories();
  }
}
