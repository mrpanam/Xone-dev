import { Component } from '@angular/core';
import { TradeService } from '../services/trade.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [JsonPipe],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class CategoryComponent {

  constructor(public tradeService: TradeService) {}

  async ngOnInit() {
    await this.tradeService.loadCategories();
  }

  async refreshCategories() {
    await this.tradeService.refreshCategories();
  }

}
