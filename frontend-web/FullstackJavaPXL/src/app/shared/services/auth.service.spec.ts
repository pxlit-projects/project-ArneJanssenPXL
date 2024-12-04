import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should log in a user with valid credentials', () => {
      const email = 'redacteur@gmail.com';
      const password = 'password123';
      const result = service.login(email, password);

      expect(result).toBeTrue();
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.getRole()).toBe('Redacteur');
    });

    it('should not log in a user with invalid credentials', () => {
      const email = 'invalid@gmail.com';
      const password = 'wrongpassword';
      const result = service.login(email, password);

      expect(result).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      expect(service.getRole()).toBeNull();
    });

    it('should not log in if only email matches but password is incorrect', () => {
      const email = 'redacteur@gmail.com';
      const password = 'wrongpassword';
      const result = service.login(email, password);

      expect(result).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should not log in if only password matches but email is incorrect', () => {
      const email = 'invalid@gmail.com';
      const password = 'password123';
      const result = service.login(email, password);

      expect(result).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('logout()', () => {
    it('should log out the user', () => {
      service.login('redacteur@gmail.com', 'password123'); 
      expect(service.isLoggedIn()).toBeTrue();

      service.logout();

      expect(service.isLoggedIn()).toBeFalse();
      expect(service.getRole()).toBeNull();
    });
  });

  describe('isLoggedIn()', () => {
    it('should return false if no user is logged in', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return true if a user is logged in', () => {
      service.login('redacteur@gmail.com', 'password123');
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  describe('getRole()', () => {
    it('should return the role of the logged-in user', () => {
      service.login('gebruiker@gmail.com', 'password123');
      expect(service.getRole()).toBe('Gebruiker');
    });

    it('should return null if no user is logged in', () => {
      expect(service.getRole()).toBeNull();
    });
  });
});

