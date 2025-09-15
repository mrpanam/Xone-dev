import { Routes } from "@angular/router";
import { TradeComponent } from "./trade/trade";
import { CategoryComponent } from "./category/category";
import { AboutComponent } from "./about/about";
import { HomeComponent } from "./home/home";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trades', component: TradeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
