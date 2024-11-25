import { Component, inject } from '@angular/core';
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
export class LoginComponent {
  email = '';
  password = '';
  loginFailed = false;

  router: Router = inject(Router);

  constructor(public authService: AuthService) {}

  login(): void {
    if (this.authService.login(this.email, this.password)) {
      this.loginFailed = false;
      this.router.navigate(['/posts']);
    } else {
      this.loginFailed = true;
    }
  }
}
