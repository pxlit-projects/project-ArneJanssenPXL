import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isRedacteur(): boolean {
    return this.authService.getRole() === 'Redacteur';
  }

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() != null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/posts']);
  }
}
