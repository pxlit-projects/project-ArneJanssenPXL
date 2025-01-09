import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>
  let routerMock: jasmine.SpyObj<Router>

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getRole', 'getCurrentUser', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, MatIconModule, RouterLink],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isRedacteur', () => {
    it('should return true if the user role is Redacteur', () => {
      authServiceMock.getRole.and.returnValue('Redacteur');
      expect(component.isRedacteur()).toBeTrue();
      expect(authServiceMock.getRole).toHaveBeenCalled();
    });

    it('should return false if the user role is not Redacteur', () => {
      authServiceMock.getRole.and.returnValue('Gebruiker');
      expect(component.isRedacteur()).toBeFalse();
      expect(authServiceMock.getRole).toHaveBeenCalled();
    });

    it('should return false if there is no role', () => {
      authServiceMock.getRole.and.returnValue(null);
      expect(component.isRedacteur()).toBeFalse();
      expect(authServiceMock.getRole).toHaveBeenCalled();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if a user is logged in', () => {
      authServiceMock.getCurrentUser.and.returnValue({ username: 'user', role: 'Redacteur', id: 1, password: 'test' });
      expect(component.isLoggedIn()).toBeTrue();
      expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    });

    it('should return false if no user is logged in', () => {
      authServiceMock.getCurrentUser.and.returnValue(null);
      expect(component.isLoggedIn()).toBeFalse();
      expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and navigate to /posts', () => {
      component.logout();
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
    });

    it('should handle navigation error gracefully', () => {
      routerMock.navigate.and.throwError('Navigation error');
      expect(() => component.logout()).not.toThrow();
      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });
});