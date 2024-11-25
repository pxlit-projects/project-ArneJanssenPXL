import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: User | null = null;

  private readonly users: User[] = [
    { email: 'redacteur@gmail.com', password: 'password123', role: 'Redacteur' },
    { email: 'gebruiker@gmail.com', password: 'password123', role: 'Gebruiker' },
  ];

  login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);

    if (user) {
      this.loggedInUser = user;
      return true;
    }

    this.loggedInUser = null;
    return false;
  }
  
  logout(): void {
    this.loggedInUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.loggedInUser;
  }

  getRole(): string | null {
    return this.loggedInUser?.role || null;
  }
}
