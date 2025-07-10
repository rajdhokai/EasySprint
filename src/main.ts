import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { NavbarComponent } from './app/components/layout/navbar/navbar.component';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="authService.isAuthenticated()"></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .main-content {
      flex: 1;
      overflow: auto;
    }
  `]
})
export class App {
  constructor(public authService: AuthService) {}
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
});