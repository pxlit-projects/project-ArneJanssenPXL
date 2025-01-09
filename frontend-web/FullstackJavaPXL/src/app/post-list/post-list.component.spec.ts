import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { PostStatus } from '../shared/models/postStatus.model';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>
  let authServiceMock: jasmine.SpyObj<AuthService>

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    postServiceMock = jasmine.createSpyObj('PostService', ['getPostsByAuthorIdAndStatus', 'filterPublishedPosts', 'getAllPublishedPosts']);

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call authService.getCurrentUser and fetch published posts', () => {
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'Post Title',
          content: 'Post Content',
          category: 'Category',
          postStatus: 'PUBLISHED',
          author: 'redacteur1',
          authorId: 3,
          dateCreated: new Date(),
          datePublished: new Date(),
        },
      ];
      postServiceMock.getAllPublishedPosts.and.returnValue(of(mockPosts));

      component.ngOnInit();

      expect(postServiceMock.getAllPublishedPosts).toHaveBeenCalled();
      expect(component.posts).toEqual(mockPosts);
    });

    it('should handle errors when fetching published posts', () => {
      postServiceMock.getAllPublishedPosts.and.returnValue(throwError(() => new Error('Network Error')));

      component.ngOnInit();

      expect(postServiceMock.getAllPublishedPosts).toHaveBeenCalled();
      expect(component.posts).toEqual([]);
    });
  });

  describe('handleFilter', () => {
    it('should call postService.filterPublishedPosts with filter and update posts', () => {
      const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };
      const mockFilteredPosts: Post[] = [
        {
          id: 2,
          title: 'Filtered Post',
          content: 'Filtered Content',
          category: 'Category',
          postStatus: 'PUBLISHED',
          author: 'redacteur1',
          authorId: 3,
          dateCreated: new Date(),
          datePublished: new Date(),
        },
      ];
      postServiceMock.filterPublishedPosts.and.returnValue(of(mockFilteredPosts));

      component.handleFilter(mockFilter);

      expect(postServiceMock.filterPublishedPosts).toHaveBeenCalledWith(mockFilter);
      expect(component.posts).toEqual(mockFilteredPosts);
    });

    it('should handle errors when filtering posts', () => {
      const mockFilter: Filter = { content: 'test', author: '', datePublished: new Date() };
      postServiceMock.filterPublishedPosts.and.returnValue(throwError(() => new Error('Filter Error')));

      component.handleFilter(mockFilter);

      expect(postServiceMock.filterPublishedPosts).toHaveBeenCalledWith(mockFilter);
      expect(component.posts).toEqual([]);
    });
  });
});

