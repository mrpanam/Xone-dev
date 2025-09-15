import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { TradeService } from '../services/trade.service';
import { Trade } from '../models/trade.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './home.html',
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: none;
      border-radius: 0.5rem;
      transition: transform 0.2s ease-in-out;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .card-title {
      color: #333;
      font-weight: 600;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .display-4 {
      font-size: 2.5rem;
      font-weight: 600;
    }
  `]
})
export class HomeComponent implements OnInit {
  totalPnL = 0;
  totalAssets = 0; // Will be implemented later
  recentTrades: Trade[] = [];
  loading = true;

  constructor(private tradeService: TradeService) {}

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    try {
      this.loading = true;
      await this.tradeService.loadTrades();
      this.updateTotals();
      this.updateRecentTrades();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  private updateTotals() {
    this.totalPnL = this.tradeService.getTotalPnL();
    // Calculate total assets (sum of current value of all positions)
    this.totalAssets = this.tradeService.trades?.reduce((total, trade) => {
      return total + (trade.current_price * trade.quantity);
    }, 0) || 0;
  }

  private updateRecentTrades() {
    // Get the 5 most recent trades
    this.recentTrades = [...this.tradeService.trades]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }

  getProfitLoss(trade: Trade): number {
    return this.tradeService.getProfitLoss(trade);
  }
}
