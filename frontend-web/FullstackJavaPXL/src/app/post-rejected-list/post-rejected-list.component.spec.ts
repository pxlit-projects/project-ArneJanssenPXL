import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRejectedListComponent } from './post-rejected-list.component';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { Post } from '../shared/models/post.model';
import { of } from 'rxjs';
import { PostStatus } from '../shared/models/postStatus.model';
import { Filter } from '../shared/models/filter.model';

describe('PostRejectedListComponent', () => {
  let component: PostRejectedListComponent;
  let fixture: ComponentFixture<PostRejectedListComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>
  let authServiceMock: jasmine.SpyObj<AuthService>

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    postServiceMock = jasmine.createSpyObj('PostService', ['getPostsByAuthorIdAndStatus', 'filterRejectedPosts']);

    await TestBed.configureTestingModule({
      imports: [PostRejectedListComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostRejectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call authService.getCurrentUser and fetch rejected posts', () => {
      const mockUser: User = { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 };
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'Post Title',
          content: 'Post Content',
          category: 'Category',
          postStatus: 'REJECTED',
          author: 'redacteur1',
          authorId: 3,
          dateCreated: new Date(),
          datePublished: new Date(),
        },
      ];

      authServiceMock.getCurrentUser.and.returnValue(mockUser);
      postServiceMock.getPostsByAuthorIdAndStatus.and.returnValue(of(mockPosts));

      component.ngOnInit();

      expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
      expect(postServiceMock.getPostsByAuthorIdAndStatus).toHaveBeenCalledWith(
        mockUser.username,
        mockUser.id,
        mockUser.role,
        PostStatus.REJECTED
      );
      expect(component.posts).toEqual(mockPosts);
    });
  });

  describe('handleFilter', () => {
    it('should call postService.filterRejectedPosts with filter and update posts', () => {
      const mockUser: User = { username: 'redacteur1', password: 'azerty', role: 'Redacteur', id: 3 };
        const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };
        const mockFilteredPosts: Post[] = [
          {
            id: 2,
            title: 'Filtered Post',
            content: 'Filtered Content',
            category: 'Category',
            postStatus: 'REJECTED',
            author: 'redacteur1',
            authorId: 3,
            dateCreated: new Date(),
            datePublished: new Date(),
        },
      ];

      authServiceMock.getCurrentUser.and.returnValue(mockUser);
      postServiceMock.filterRejectedPosts.and.returnValue(of(mockFilteredPosts));

      component.user = mockUser;
      component.handleFilter(mockFilter);

      expect(postServiceMock.filterRejectedPosts).toHaveBeenCalledWith(
        mockFilter,
        mockUser.username,
        mockUser.id,
        mockUser.role
      );
      expect(component.posts).toEqual(mockFilteredPosts);
    });

    it('should not call filterRejectedPosts if user is undefined', () => {
      const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };

      component.user = null;
      component.handleFilter(mockFilter);

      expect(postServiceMock.filterRejectedPosts).not.toHaveBeenCalled();
    });
  });
});
