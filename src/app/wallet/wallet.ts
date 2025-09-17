import { Component } from '@angular/core';

@Component({
  selector: 'app-wallet',
  standalone: true,
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">My Wallet</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Wallet Management</h5>
          <p class="card-text">Manage your trading wallet, deposits, and withdrawals.</p>
          <p class="text-muted">This is a placeholder for the wallet functionality.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class WalletComponent {}