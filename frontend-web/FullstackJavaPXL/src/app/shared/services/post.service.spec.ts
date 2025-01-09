import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';
import { environment } from '../../../environments/environment';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl + 'post/api/post';

  const mockPosts: Post[] = [
    { id: 1, title: 'Title1', content: 'Content1', category: 'Category1', postStatus: 'PUBLISHED', author: 'Author1', authorId: 1, dateCreated: new Date('2023-11-01'), datePublished: new Date('2023-11-01') },
    { id: 2, title: 'Title2', content: 'Content2', category: 'Category2', postStatus: 'CONCEPT', author: 'Author2', authorId: 2, dateCreated: new Date('2023-11-02'), datePublished: new Date('2023-11-02') },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all published posts', () => {
    service.getAllPublishedPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch all submitted posts', () => {
    const username = 'Author1';
    const userId = 1;
    const role = 'USER';

    service.getAllSubmittedPosts(username, userId, role).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/submitted`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('userId')).toBe(userId.toString());
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(mockPosts);
  });

  it('should create a new post', () => {
    const newPost: Post = {
      id: 3,
      title: 'Title3',
      content: 'Content3',
      category: 'Category3',
      postStatus: 'CONCEPT',
      author: 'Author3',
      authorId: 3,
      dateCreated: new Date('2023-11-03'),
      datePublished: new Date('2023-11-03'),
    };

    const username = 'Author3';
    const userId = 3;
    const role = 'USER';

    service.createPost(newPost, username, userId, role).subscribe((post) => {
      expect(post).toEqual(newPost);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('userId')).toBe(userId.toString());
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(newPost);
  });

  it('should update a post by ID', () => {
    const updatedPost: Post = {
      id: 1,
      title: 'Updated Title',
      content: 'Updated Content',
      category: 'Updated Category',
      postStatus: 'PUBLISHED',
      author: 'Updated Author',
      authorId: 1,
      dateCreated: new Date('2023-11-01'),
      datePublished: new Date('2023-11-04'),
    };

    const username = 'Updated Author';
    const userId = 1;
    const role = 'ADMIN';

    service.updatePost(1, updatedPost, username, userId, role).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('userId')).toBe(userId.toString());
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(null);
  });

  it('should publish a post', () => {
    const username = 'Editor';
    const userId = 2;
    const role = 'EDITOR';

    service.publishPost(1, username, userId, role).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne(`${apiUrl}/1/publish`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('userId')).toBe(userId.toString());
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(null);
  });

  it('should fetch a post by ID', () => {
    const post = mockPosts[0];

    service.getPostById(1).subscribe((fetchedPost) => {
      expect(fetchedPost).toEqual(post);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(post);
  });

  it('should filter published posts based on criteria', () => {
    const filter: Filter = { content: 'Content1', author: 'Author1', datePublished: new Date('2023-11-01') };

    service.filterPublishedPosts(filter).subscribe((posts) => {
      expect(posts).toEqual([mockPosts[0]]);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
