import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;

  const mockPosts: Post[] = [
    new Post('John Doe', 'Post Content 1', new Date(), false, 'Post Title 1', 'Tech'),
    new Post('Jane Smith', 'Post Content 2', new Date(), false, 'Post Title 2', 'Lifestyle')
  ];

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getAllPublishedPosts', 'filterPublishedPosts']);

    await TestBed.configureTestingModule({
      imports: [PostListComponent, HttpClientTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all published posts on initialization', () => {
    postServiceMock.getAllPublishedPosts.and.returnValue(of(mockPosts));

    fixture.detectChanges();

    expect(postServiceMock.getAllPublishedPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
  });

  it('should filter posts based on the filter criteria', () => {
    const filter: Filter = {
      content: 'Post Content 1',
      author: 'John Doe',
      datePublished: null
    };
    const filteredPosts: Post[] = [
      new Post('John Doe', 'Post Content 1', new Date(), false, 'Post Title 1', 'Tech')
    ];

    postServiceMock.filterPublishedPosts.and.returnValue(of(filteredPosts));

    component.handleFilter(filter);

    expect(postServiceMock.filterPublishedPosts).toHaveBeenCalledWith(filter);
    expect(component.posts).toEqual(filteredPosts);
  });
});

