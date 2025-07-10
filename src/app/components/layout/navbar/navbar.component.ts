import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CurrentUser } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        EasySprint
      </span>
      <span class="spacer"></span>
      <div *ngIf="currentUser">
        <button mat-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
          {{ currentUser.username }}
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 1.2em;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: CurrentUser | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}