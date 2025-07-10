import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task, TaskStatus } from '../../models/task.model';
import { CreateTaskDialogComponent } from '../dialogs/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    DragDropModule
  ],
  template: `
    <div class="kanban-container" *ngIf="project">
      <div class="kanban-header">
        <h1>{{ project.name }}</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="createTask()">
            <mat-icon>add</mat-icon>
            Add Task
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to Dashboard
          </button>
        </div>
      </div>
      
      <div class="kanban-board">
        <div class="kanban-column">
          <div class="column-header">
            <h3>To Do</h3>
            <mat-chip-set>
              <mat-chip>{{ todoTasks.length }}</mat-chip>
            </mat-chip-set>
          </div>
          <div class="task-list" 
               cdkDropList 
               #todoList="cdkDropList"
               [cdkDropListData]="todoTasks"
               [cdkDropListConnectedTo]="[inProgressList, doneList]"
               (cdkDropListDropped)="drop($event)">
            <div class="task-card" 
                 *ngFor="let task of todoTasks" 
                 cdkDrag
                 [cdkDragData]="task">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ task.title }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ task.description }}</p>
                  <div class="task-meta" *ngIf="task.dueDate">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ task.dueDate | date }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </div>
        
        <div class="kanban-column">
          <div class="column-header">
            <h3>In Progress</h3>
            <mat-chip-set>
              <mat-chip>{{ inProgressTasks.length }}</mat-chip>
            </mat-chip-set>
          </div>
          <div class="task-list" 
               cdkDropList 
               #inProgressList="cdkDropList"
               [cdkDropListData]="inProgressTasks"
               [cdkDropListConnectedTo]="[todoList, doneList]"
               (cdkDropListDropped)="drop($event)">
            <div class="task-card" 
                 *ngFor="let task of inProgressTasks" 
                 cdkDrag
                 [cdkDragData]="task">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ task.title }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ task.description }}</p>
                  <div class="task-meta" *ngIf="task.dueDate">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ task.dueDate | date }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </div>
        
        <div class="kanban-column">
          <div class="column-header">
            <h3>Done</h3>
            <mat-chip-set>
              <mat-chip>{{ doneTasks.length }}</mat-chip>
            </mat-chip-set>
          </div>
          <div class="task-list" 
               cdkDropList 
               #doneList="cdkDropList"
               [cdkDropListData]="doneTasks"
               [cdkDropListConnectedTo]="[todoList, inProgressList]"
               (cdkDropListDropped)="drop($event)">
            <div class="task-card" 
                 *ngFor="let task of doneTasks" 
                 cdkDrag
                 [cdkDragData]="task">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ task.title }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ task.description }}</p>
                  <div class="task-meta" *ngIf="task.dueDate">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ task.dueDate | date }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-container {
      padding: 24px;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-actions {
      display: flex;
      gap: 12px;
    }
    .kanban-board {
      display: flex;
      gap: 24px;
      flex: 1;
      overflow: hidden;
    }
    .kanban-column {
      flex: 1;
      min-width: 300px;
      background-color: #f5f5f5;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    .task-list {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      min-height: 200px;
    }
    .task-card {
      margin-bottom: 16px;
    }
    .task-card mat-card {
      cursor: move;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .task-card mat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }
    .task-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9em;
      margin-top: 8px;
    }
    .task-meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drop-list-receiving {
      background-color: #e8f5e8;
    }
  `]
})
export class KanbanComponent implements OnInit {
  project: Project | null = null;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.loadProject(projectId);
      this.loadTasks(projectId);
    });
  }

  loadProject(id: string): void {
    this.project = this.projectService.getProjectById(id) || null;
  }

  loadTasks(projectId: string): void {
    this.todoTasks = this.taskService.getTasksByStatus(projectId, TaskStatus.TODO);
    this.inProgressTasks = this.taskService.getTasksByStatus(projectId, TaskStatus.IN_PROGRESS);
    this.doneTasks = this.taskService.getTasksByStatus(projectId, TaskStatus.DONE);
  }

  createTask(): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px',
      data: { projectId: this.project.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result);
        this.loadTasks(this.project!.id);
      }
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
      this.loadTasks(this.project!.id);
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status based on the container
      const task = event.container.data[event.currentIndex];
      let newStatus: TaskStatus;
      
      if (event.container.data === this.todoTasks) {
        newStatus = TaskStatus.TODO;
      } else if (event.container.data === this.inProgressTasks) {
        newStatus = TaskStatus.IN_PROGRESS;
      } else {
        newStatus = TaskStatus.DONE;
      }
      
      this.taskService.updateTask(task.id, { status: newStatus });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}