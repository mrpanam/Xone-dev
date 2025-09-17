import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { TradeService } from '../services/trade.service';
import { Trade } from '../models/trade.model';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css', 
})
export class DashboardComponent implements OnInit {
  @ViewChild('stocksChart') private chartRef!: ElementRef;
  totalPnL = 0;
  totalAssets = 0;
  recentTrades: Trade[] = [];
  topStocks: { symbol: string; change: number; currentPrice: number }[] = [];
  chart: any;
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
      this.updateTopStocks();
      this.updateChart();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  private updateTopStocks() {
    console.log('Updating top stocks...');
    console.log('Trades:', this.tradeService.trades);
    
    // Group trades by symbol and calculate average change
    const stocksMap = new Map<string, { sum: number; count: number; currentPrice: number }>();
    
    this.tradeService.trades.forEach((trade: Trade) => {
      if (!stocksMap.has(trade.symbol)) {
        stocksMap.set(trade.symbol, { 
          sum: this.calculatePercentageChange(trade), 
          count: 1, 
          currentPrice: trade.current_price 
        });
      } else {
        const stock = stocksMap.get(trade.symbol)!;
        stock.sum += this.calculatePercentageChange(trade);
        stock.count++;
        // Keep the latest price
        stock.currentPrice = trade.current_price;
      }
    });

    // Convert to array, calculate average and sort by absolute change
    this.topStocks = Array.from(stocksMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        change: data.sum / data.count,
        currentPrice: data.currentPrice
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 5); // Get top 5
  }

  private calculatePercentageChange(trade: Trade): number {
    if (!trade.bought_price || trade.bought_price === 0) return 0;
    return ((trade.current_price - trade.bought_price) / trade.bought_price) * 100;
  }

  private updateChart() {
    if (!this.topStocks.length || !this.chartRef) return;
    
    // Register the datalabels plugin
    Chart.register(ChartDataLabels);

    const ctx = this.chartRef.nativeElement.getContext('2d');
    
    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.topStocks.map(stock => stock.symbol);
    const data = this.topStocks.map(stock => stock.change);
    const colors = data.map(change => 
      change > 0 ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'
    );

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 0,
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 10,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`,
            color: (context: any) => {
              return context.dataset.data[context.dataIndex] > 0 
                ? 'rgba(40, 167, 69, 1)' 
                : 'rgba(220, 53, 69, 1)';
            },
            font: {
              weight: 'bold',
              size: 11
            },
            padding: {
              top: 4
            }
          },
          tooltip: {
            backgroundColor: 'rgba(33, 37, 41, 0.95)',
            titleColor: '#fff',
            bodyColor: '#dee2e6',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context: any) => {
                const stock = this.topStocks[context.dataIndex];
                return [
                  `Change: ${context.parsed.y.toFixed(2)}%`,
                  `Price: ${stock.currentPrice.toFixed(2)}`
                ];
              },
              title: () => '' // Remove the title
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            border: {
              display: false
            },
            ticks: {
              color: '#6c757d',
              font: {
                size: 12
              },
              padding: 8,
              callback: (value: any) => `${value}%`
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: '#212529',
              font: {
                weight: 600 as const,
                size: 13
              }
            }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  private updateTotals() {
    this.totalPnL = this.tradeService.getTotalPnL();
    // Calculate total assets (sum of current value of all positions)
    this.totalAssets = this.tradeService.trades?.reduce((total, trade) => {
      return total + (trade.current_price * trade.quantity);
    }, 0) || 0;
  }

  private updateRecentTrades() {
    console.log('All trades from service:', this.tradeService.trades);
    
    const sortedTrades = [...this.tradeService.trades]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
      
    console.log('Top 5 trades after sorting:', sortedTrades);
    
    this.recentTrades = sortedTrades.map(trade => {
      const status = trade.status ? String(trade.status).toLowerCase() : 'pending';
      console.log(`Trade ${trade.symbol} status:`, { 
        originalStatus: trade.status, 
        processedStatus: status,
        type: typeof trade.status
      });
      
      return {
        ...trade,
        status
      };
    });
  }

  getProfitLoss(trade: Trade): number {
    return this.tradeService.getProfitLoss(trade);
  }
}