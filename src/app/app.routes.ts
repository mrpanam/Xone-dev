import { Routes } from "@angular/router";
import { TradeComponent } from "./trade/trade";
import { CategoryComponent } from "./category/category";
import { AboutComponent } from "./about/about";
import { HomeComponent } from "./home/home";
import { DashboardComponent } from "./dashboard/dashboard";
import { WalletComponent } from "./wallet/wallet";
import { AnalyticsComponent } from "./analytics/analytics";
import { SettingsComponent } from "./settings/settings";

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: 'trades', component: TradeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
