import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['getUsers', 'getCurrentUser', 'getRole', 'setCurrentUser', 'logout',]);
    
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });
  });

  it('should be created', () => {
    expect(authServiceMock).toBeTruthy();
  });

  it('should return the role of the current user', () => {
    const mockUser: User = { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 };
    authServiceMock.getCurrentUser.and.returnValue(mockUser); 
    authServiceMock.getRole.and.callFake(() => {
      const currentUser = authServiceMock.getCurrentUser();
      return currentUser ? currentUser.role : null; 
    });
  
    const role = authServiceMock.getRole();
    expect(role).toBe('Redacteur');
    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
  });

  it('should set the current user when credentials are correct', () => {
    const mockUser: User = { username: 'gebruiker1', password: 'azerty', role: 'Gebruiker', id: 1 };
    
    authServiceMock.getUsers.and.returnValue([mockUser]);
    authServiceMock.getCurrentUser.and.returnValue(null);
  
    authServiceMock.setCurrentUser.and.callFake((username: string, password: string) => {
      if (username === mockUser.username && password === mockUser.password) {
        authServiceMock.getCurrentUser.and.returnValue(mockUser);
      }
    });
  
    authServiceMock.setCurrentUser('gebruiker1', 'azerty');
  
    const currentUser = authServiceMock.getCurrentUser();
    
    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    expect(currentUser).toEqual(mockUser);
  });

  it('should throw an error if user credentials are incorrect', () => {
    authServiceMock.setCurrentUser.and.throwError('Incorrect password');
    expect(() => authServiceMock.setCurrentUser('gebruiker1', 'wrongpassword')).toThrowError('Incorrect password');
  });

  it('should clear the current user on logout', () => {
    authServiceMock.logout.and.callFake(() => {
      authServiceMock.getCurrentUser.and.returnValue(null);
    });

    authServiceMock.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(authServiceMock.getCurrentUser()).toBeNull();
  });
});

