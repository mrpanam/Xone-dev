import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradeService } from '../services/trade.service';
import { Trade } from '../models/trade.model';
import { FilterTradesPipe } from '../pipes/filter-trades.pipe';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [
    JsonPipe, 
    CurrencyPipe, 
    DecimalPipe,
    DatePipe,
    CommonModule,
    FormsModule,
    FilterTradesPipe,
    NgClass
  ],
  templateUrl: './trade.html',
  styleUrls: ['./trade.css'],
  providers: [TradeService],
})
export class TradeComponent implements OnInit {
  searchTerm = '';
  
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

  getTotalPnL(): number {
    return this.tradeService.getTotalPnL();
  }
}
