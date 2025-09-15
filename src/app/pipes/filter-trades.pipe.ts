import { Pipe, PipeTransform } from '@angular/core';
import { Trade } from '../models/trade.model';

@Pipe({
  name: 'filterTrades',
  standalone: true
})
export class FilterTradesPipe implements PipeTransform {
  transform(trades: Trade[] | null, searchTerm: string = ''): Trade[] {
    if (!trades) return [];
    if (!searchTerm.trim()) return [...trades];

    const term = searchTerm.trim().toLowerCase();
    
    return trades.filter(trade => {
      if (!trade) return false;
      
      return (
        (trade.symbol && trade.symbol.toLowerCase().includes(term)) ||
        (trade.category?.id?.String && trade.category.id.String.toLowerCase().includes(term)) ||
        (trade.status && trade.status.toLowerCase().includes(term)) ||
        (trade.quantity && trade.quantity.toString().includes(term)) ||
        (trade.bought_price && trade.bought_price.toString().includes(term)) ||
        (trade.current_price && trade.current_price.toString().includes(term))
      );
    });
  }
}
