import { Component, OnInit } from '@angular/core';
import { JsonPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { TradeService } from '../services/trade.service';
import { Trade } from '../models/trade.model';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [JsonPipe, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './trade.html',
  styleUrls: ['./trade.css'],
  providers: [TradeService]
})
export class TradeComponent implements OnInit {
  constructor(public tradeService: TradeService) {}

  async ngOnInit() {
    await this.loadTrades();
  }

  async loadTrades() {
    try {
      await this.tradeService.loadTrades();
    } catch (error) {
      console.error('Failed to load trades:', error);
    }
  }

  async refreshTrades() {
    await this.loadTrades();
  }

  getProfitLoss(trade: Trade): number {
    return (trade.current_price - trade.bought_price) * trade.quantity;
  }

  getProfitLossClass(trade: Trade): string {
    const pnl = this.getProfitLoss(trade);
    return pnl >= 0 ? 'text-success' : 'text-danger';
  }
}
