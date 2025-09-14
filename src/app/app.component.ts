import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";  
import { NavbarComponent } from "./navbar/navbar";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = 'Xone';
}
