import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Banner } from '../banner/banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css', 
})
export class HomeComponent {}
