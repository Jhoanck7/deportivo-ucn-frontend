import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    template: `
        
        <div class="app-container">
        <app-navbar></app-navbar>
        
        <!-- Aquí es donde Angular cargará dinámicamente el Home, Members, Activities, etc. -->
        <main class="main-content">
        
            <router-outlet></router-outlet>
        </main>
        
        <app-footer></app-footer>
        </div>
    `,
    styles: `.app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }
    .main-content {
      flex: 1;
      width: 100%; 
      padding-top: 70px;
      box-sizing: border-box;
    }`,
})

export class MainLayoutComponent {}
