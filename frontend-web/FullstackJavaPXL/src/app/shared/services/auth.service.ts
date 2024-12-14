import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'gebruiker1', password: 'azerty', role: 'Gebruiker', id: 1 },
    { username: 'gebruiker2', password: 'azerty', role: 'Gebruiker', id: 2 },
    { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 },
    { username: 'redacteur2', password: 'azerty', role: 'Redacteur', id: 4 },
  ];

  private currentUser: User | null = null;

  private saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User | null {
    const storedUserData = localStorage.getItem('currentUser');
    return storedUserData ? JSON.parse(storedUserData) as User : null;
  }

  getRole(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.role : null;
  }

  setCurrentUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      if (user.password === password) {
        this.currentUser = user;
        this.saveCurrentUser();
      } else {
        throw new Error('Incorrect password');
      }
    } else {
      throw new Error('User not found');
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }
}
