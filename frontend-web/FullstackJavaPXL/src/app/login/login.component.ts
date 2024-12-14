import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  
  username = '';
  password = '';
  loginError: string | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
  }

  login(): void {
    this.loginError = null;
    try {
      this.authService.setCurrentUser(this.username, this.password);
      this.router.navigate(['/posts']);
    } catch (error: any) {
      this.loginError = String(error).replace('Error: ', '');
    }
  }
}

