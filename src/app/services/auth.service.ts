import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, CurrentUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUserSubject.next(JSON.parse(currentUser));
    }
  }

  register(username: string, email: string, password: string): boolean {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(u => u.username === username || u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: this.generateId(),
      username,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const currentUser: CurrentUser = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUserSubject.next(currentUser);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}