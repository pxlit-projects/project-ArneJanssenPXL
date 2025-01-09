import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './shared/services/auth.service';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  const executeGuard: CanActivateFn = (...guardParameters) => 
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getRole']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation if role is "Redacteur"', () => {
    authServiceMock.getRole.and.returnValue('Redacteur');
    const routeMock = {} as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result = executeGuard(routeMock, stateMock);

    expect(result).toBeTrue(); 
    expect(routerMock.navigate).not.toHaveBeenCalled(); 
  });

  it('should not allow activation if role is not "Redacteur"', () => {
    authServiceMock.getRole.and.returnValue('User');
    const routeMock = {} as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result = executeGuard(routeMock, stateMock);

    expect(result).toBeFalse();  
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);  
  });
});
