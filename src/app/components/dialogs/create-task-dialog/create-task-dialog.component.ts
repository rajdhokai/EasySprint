import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Task</h2>
    <mat-dialog-content>
      <form #taskForm="ngForm">
        <mat-form-field class="full-width">
          <mat-label>Task Title</mat-label>
          <input matInput name="title" [(ngModel)]="title" required>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput name="description" [(ngModel)]="description" rows="3"></textarea>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Status</mat-label>
          <mat-select name="status" [(ngModel)]="status" required>
            <mat-option value="todo">To Do</mat-option>
            <mat-option value="inprogress">In Progress</mat-option>
            <mat-option value="done">Done</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field class="full-width">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" name="dueDate" [(ngModel)]="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!title">
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
export class CreateTaskDialogComponent {
  title = '';
  description = '';
  status: TaskStatus = TaskStatus.TODO;
  dueDate: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.title) {
      this.dialogRef.close({
        title: this.title,
        description: this.description,
        status: this.status,
        projectId: this.data.projectId,
        dueDate: this.dueDate
      });
    }
  }
}