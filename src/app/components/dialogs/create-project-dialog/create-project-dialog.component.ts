import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Project</h2>
    <mat-dialog-content>
      <form #projectForm="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Project Name</mat-label>
          <input matInput name="name" [(ngModel)]="name" required>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput name="description" [(ngModel)]="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!name">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class CreateProjectDialogComponent {
  name = '';
  description = '';

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.name) {
      this.dialogRef.close({
        name: this.name,
        description: this.description
      });
    }
  }
}