import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.getRole() == "Redacteur"){
    return true;
  }  
  else{
    router.navigate(['/login']);
    return false;
  }
};
