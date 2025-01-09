import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../shared/services/auth.service'; 
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['saveCurrentUser', 'getUsers', 'getCurrentUser', 'getRole', 'setCurrentUser', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getCurrentUser from AuthService', () => {
      //authServiceMock.getCurrentUser.and.returnValue(null);
      component.ngOnInit();

      expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      component.username = 'gebruiker1';
      component.password = 'azerty';
    });

    it('should call setCurrentUser with correct credentials and navigate on success', () => {
      authServiceMock.setCurrentUser.and.callThrough();

      component.login();

      expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith('gebruiker1', 'azerty');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
      expect(component.loginError).toBeNull();
    });

    it('should set loginError if password is incorrect', () => {
      authServiceMock.setCurrentUser.and.throwError('Incorrect password');

      component.login();

      expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith('gebruiker1', 'azerty');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(component.loginError).toBe('Incorrect password');
    });

    it('should set loginError if user does not exist', () => {
      authServiceMock.setCurrentUser.and.throwError('User not found');

      component.login();

      expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith('gebruiker1', 'azerty');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(component.loginError).toBe('User not found');
    });
  });
});

