import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Register for EasySprint</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form #registerForm="ngForm" (ngSubmit)="onRegister(registerForm)">
            <mat-form-field class="full-width">
              <mat-label>Username</mat-label>
              <input matInput name="username" [(ngModel)]="username" required>
            </mat-form-field>
            
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" name="email" [(ngModel)]="email" required>
            </mat-form-field>
            
            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" name="password" [(ngModel)]="password" required>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="!registerForm.valid">
              Register
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .auth-card {
      width: 400px;
      max-width: 90vw;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-card-actions {
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onRegister(form: any): void {
    if (form.valid) {
      if (this.authService.register(this.username, this.email, this.password)) {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open('User already exists', 'Close', {
          duration: 3000
        });
      }
    }
  }
}