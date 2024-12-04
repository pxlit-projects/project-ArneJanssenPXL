import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { PostListConceptComponent } from './post-list-concept.component';

describe('PostListConceptComponent', () => {
  let component: PostListConceptComponent;
  let fixture: ComponentFixture<PostListConceptComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;

  const mockPosts: Post[] = [
    new Post('John Doe', 'Post Content 1', new Date(), true, 'Post Title 1', 'Tech'),
    new Post('Jane Smith', 'Post Content 2', new Date(), true, 'Post Title 2', 'Lifestyle')
  ];

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getAllConceptPosts', 'filterConceptPosts']);

    await TestBed.configureTestingModule({
      imports: [PostListConceptComponent, HttpClientTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListConceptComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all concept posts on initialization', () => {
    postServiceMock.getAllConceptPosts.and.returnValue(of(mockPosts));

    fixture.detectChanges();

    expect(postServiceMock.getAllConceptPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
  });

  it('should filter posts based on the filter criteria', () => {
    const filter: Filter = {
      content: 'Post Content 1',
      author: 'John Doe',
      datePublished: null
    };
    const filteredPosts: Post[] = [
      new Post('John Doe', 'Post Content 1', new Date(), true, 'Post Title 1', 'Tech')
    ];

    postServiceMock.filterConceptPosts.and.returnValue(of(filteredPosts));

    component.handleFilter(filter);

    expect(postServiceMock.filterConceptPosts).toHaveBeenCalledWith(filter);
    expect(component.posts).toEqual(filteredPosts);
  });
});