import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { CreateProjectDialogComponent } from '../dialogs/create-project-dialog/create-project-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>My Projects</h1>
        <button mat-raised-button color="primary" (click)="createProject()">
          <mat-icon>add</mat-icon>
          Create Project
        </button>
      </div>
      
      <div class="projects-grid">
        <mat-card *ngFor="let project of projects" class="project-card">
          <mat-card-header>
            <mat-card-title>{{ project.name }}</mat-card-title>
            <mat-card-subtitle>{{ project.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="project-date">Created: {{ project.createdAt | date }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/projects', project.id]">
              <mat-icon>dashboard</mat-icon>
              Open Board
            </button>
            <button mat-button color="warn" (click)="deleteProject(project.id)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="create-project-card" (click)="createProject()">
          <mat-card-content>
            <mat-icon class="large-icon">add_circle_outline</mat-icon>
            <h3>Create New Project</h3>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .project-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
    }
    .create-project-card {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      cursor: pointer;
      border: 2px dashed #ccc;
      transition: all 0.3s;
    }
    .create-project-card:hover {
      border-color: #1976d2;
    }
    .large-icon {
      font-size: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    .project-date {
      color: #666;
      font-size: 0.9em;
    }
  `]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects = this.projectService.getProjects();
  }

  createProject(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.createProject(result.name, result.description);
        this.loadProjects();
      }
    });
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId);
      this.loadProjects();
    }
  }
}