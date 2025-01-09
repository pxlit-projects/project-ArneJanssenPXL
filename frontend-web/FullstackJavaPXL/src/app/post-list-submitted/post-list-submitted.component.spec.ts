import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListSubmittedComponent } from './post-list-submitted.component';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { Post } from '../shared/models/post.model';
import { of } from 'rxjs';
import { PostStatus } from '../shared/models/postStatus.model';
import { Filter } from '../shared/models/filter.model';

describe('PostListSubmittedComponent', () => {
  let component: PostListSubmittedComponent;
  let fixture: ComponentFixture<PostListSubmittedComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>
  let authServiceMock: jasmine.SpyObj<AuthService>

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    postServiceMock = jasmine.createSpyObj('PostService', ['getPostsByAuthorIdAndStatus', 'filterSubmittedPosts', 'getAllSubmittedPosts']);

    await TestBed.configureTestingModule({
      imports: [PostListSubmittedComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
      it('should call authService.getCurrentUser and fetch submitted posts', () => {
        const mockUser: User = { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 };
        const mockPosts: Post[] = [
          {
            id: 1,
            title: 'Post Title',
            content: 'Post Content',
            category: 'Category',
            postStatus: 'SUBMITTED',
            author: 'redacteur1',
            authorId: 3,
            dateCreated: new Date(),
            datePublished: new Date(),
          },
        ];
  
        authServiceMock.getCurrentUser.and.returnValue(mockUser);
        postServiceMock.getAllSubmittedPosts.and.returnValue(of(mockPosts));
  
        component.ngOnInit();
  
        expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
        expect(postServiceMock.getAllSubmittedPosts).toHaveBeenCalledWith(
          mockUser.username,
          mockUser.id,
          mockUser.role
        );
        expect(component.posts).toEqual(mockPosts);
      });
  
      it('should handle no user returned by authService', () => {
        authServiceMock.getCurrentUser.and.returnValue(null);
  
        component.ngOnInit();
  
        expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
        expect(postServiceMock.getPostsByAuthorIdAndStatus).not.toHaveBeenCalled();
        expect(component.posts).toEqual([]);
      });
    });
  
    describe('handleFilter', () => {
      it('should call postService.filterSubmittedPosts with filter and update posts', () => {
        const mockUser: User = { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 };
        const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };
        const mockFilteredPosts: Post[] = [
          {
            id: 2,
            title: 'Filtered Post',
            content: 'Filtered Content',
            category: 'Category',
            postStatus: 'SUBMITTED',
            author: 'redacteur1',
            authorId: 3,
            dateCreated: new Date(),
            datePublished: new Date(),
          },
        ];
  
        authServiceMock.getCurrentUser.and.returnValue(mockUser);
        postServiceMock.filterSubmittedPosts.and.returnValue(of(mockFilteredPosts));
  
        component.user = mockUser;
        component.handleFilter(mockFilter);
  
        expect(postServiceMock.filterSubmittedPosts).toHaveBeenCalledWith(
          mockUser.username,
          mockUser.id,
          mockUser.role,
          mockFilter
        );
        expect(component.posts).toEqual(mockFilteredPosts);
      });
  
      it('should not call filterSubmittedPosts if user is undefined', () => {
        const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };
  
        component.user = null;
        component.handleFilter(mockFilter);
  
        expect(postServiceMock.filterSubmittedPosts).not.toHaveBeenCalled();
      });
    });
});
