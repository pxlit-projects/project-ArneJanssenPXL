import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../shared/services/auth.service'; 
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'logout', 'getRole']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
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

  it('should call login method from AuthService with email and password', () => {
    component.email = 'test@gmail.com';
    component.password = 'password123';

    authServiceMock.login.and.returnValue(true);

    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@gmail.com', 'password123');
  });

  it('should navigate to /posts if login is successful', () => {
    authServiceMock.login.and.returnValue(true);

    component.login();

    expect(component.loginFailed).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should set loginFailed to true if login is unsuccessful', () => {
    authServiceMock.login.and.returnValue(false);

    component.login();

    expect(component.loginFailed).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});

