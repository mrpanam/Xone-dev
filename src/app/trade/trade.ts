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
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
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

  getPercentageChange(trade: Trade): number {
    if (!trade.bought_price || trade.bought_price === 0) return 0;
    return ((trade.current_price - trade.bought_price) / trade.bought_price) * 100;
  }

  sortTrades(field: string): void {
    if (this.sortField === field) {
      // Toggle sort direction if the same field is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending when a new field is selected
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    // Call the service to sort the trades
    this.tradeService.sortTrades(field, this.sortDirection);
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'bi-arrow-down';
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }
}
