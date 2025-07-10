import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      const parsedTasks = JSON.parse(tasks);
      // Convert date strings back to Date objects
      parsedTasks.forEach((task: any) => {
        task.createdAt = new Date(task.createdAt);
        task.updatedAt = new Date(task.updatedAt);
        if (task.dueDate) {
          task.dueDate = new Date(task.dueDate);
        }
      });
      this.tasksSubject.next(parsedTasks);
    }
  }

  getTasksByProject(projectId: string): Task[] {
    return this.tasksSubject.value.filter(t => t.projectId === projectId);
  }

  getTasksByStatus(projectId: string, status: TaskStatus): Task[] {
    return this.getTasksByProject(projectId).filter(t => t.status === status);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = this.tasksSubject.value;
    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(t => t.id === id);
    
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
      this.saveTasks(tasks);
    }
  }

  deleteTask(id: string): void {
    const tasks = this.tasksSubject.value.filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}