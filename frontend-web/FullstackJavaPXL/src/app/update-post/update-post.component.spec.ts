import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdatePostComponent } from './update-post.component';
import { AuthService } from '../shared/services/auth.service';
import { PostService } from '../shared/services/post.service';
import { User } from '../shared/models/user.model';
import { of } from 'rxjs';
import { Post } from '../shared/models/post.model';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        params: { id: 1 }  
      }
    };

    const mockUser: User = {
      username: 'testuser',
      password: 'password',
      role: 'Redacteur',
      id: 123
    };

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceMock.getCurrentUser.and.returnValue(mockUser); 

    postServiceMock = jasmine.createSpyObj('PostService', ['getPostById', 'updatePost']);
    postServiceMock.getPostById.and.returnValue(of({
      id: 1,
      author: "testUser",
      authorId: 123,
      title: 'Test Title',
      content: 'Test Content',
      category: 'Test Category',
      postStatus: 'CONCEPT',
      dateCreated: new Date(),
      datePublished: new Date()
    }));

    await TestBed.configureTestingModule({
      imports: [UpdatePostComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock }  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  
  });

  it('should initialize the update form with the post data', () => {
    expect(component.updateForm.value).toEqual({
      title: 'Test Title',
      content: 'Test Content',
      category: 'Test Category',
      postStatus: 'CONCEPT'
    });
  });
});

