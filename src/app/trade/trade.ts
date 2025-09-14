import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { TradeService } from '../services/trade.service';

@Component({
  selector: 'app-trade',
  imports: [JsonPipe],
  templateUrl: './trade.html',
  styleUrl: './trade.css',
  providers: [TradeService]
})
export class Trade implements OnInit {
  constructor(public tradeService: TradeService) {}

  async ngOnInit() {
    await this.tradeService.loadCategories();
  }

  async refreshCategories() {
    await this.tradeService.refreshCategories();
  }
}
