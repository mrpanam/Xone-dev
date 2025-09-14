import { Routes } from "@angular/router";
import { TradeComponent } from "./trade/trade";
import { CategoryComponent } from "./category/category";
import { AboutComponent } from "./about/about";

export const routes: Routes = [
  { path: '', redirectTo: '/trades', pathMatch: 'full' },
  { path: 'trades', component: TradeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/trades' }
];
