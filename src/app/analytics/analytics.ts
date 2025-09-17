import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Analytics</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Portfolio Analytics</h5>
          <p class="card-text">View detailed analytics and performance metrics for your trading portfolio.</p>
          <p class="text-muted">This is a placeholder for the analytics functionality.</p>
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
export class AnalyticsComponent {}