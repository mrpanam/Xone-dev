import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';  

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class Banner {

    user: User = {
      id: 'user123',
      name: 'Eric Paris',
      email: 'john.doe@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Eric+Paris&background=000000&color=fff&size=128',
      balance: 76756.75,
      level: 24,
      rating: 4.8,
      tradesCompleted: 156
    };

}
