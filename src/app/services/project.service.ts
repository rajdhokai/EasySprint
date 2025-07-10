import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadProjects();
  }

  private loadProjects(): void {
    const projects = localStorage.getItem('projects');
    if (projects) {
      this.projectsSubject.next(JSON.parse(projects));
    }
  }

  getProjects(): Project[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];
    
    const allProjects = this.projectsSubject.value;
    return allProjects.filter(p => p.ownerId === currentUser.id);
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSubject.value.find(p => p.id === id);
  }

  createProject(name: string, description: string): Project {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const newProject: Project = {
      id: this.generateId(),
      name,
      description,
      ownerId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const projects = this.projectsSubject.value;
    projects.push(newProject);
    this.saveProjects(projects);
    
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const projects = this.projectsSubject.value;
    const index = projects.findIndex(p => p.id === id);
    
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date() };
      this.saveProjects(projects);
    }
  }

  deleteProject(id: string): void {
    const projects = this.projectsSubject.value.filter(p => p.id !== id);
    this.saveProjects(projects);
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(projects));
    this.projectsSubject.next(projects);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}