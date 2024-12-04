import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';
import { environment } from '../../../environments/environment';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const mockPosts: Post[] = [
    new Post('Author1', 'Content1', new Date('2023-11-01'), false, 'Title1', 'Category1'),
    new Post('Author2', 'Content2', new Date('2023-11-02'), true, 'Title2', 'Category2'),
  ];

  const apiUrl = environment.apiUrl + 'post/api/post';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
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

  it('should fetch all posts', () => {
    service.getAllPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch all concept posts', () => {
    service.getAllConceptPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/concept`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch all published posts', () => {
    service.getAllPublishedPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should create a new post', () => {
    const newPost = new Post('Author3', 'Content3', new Date('2023-11-03'), false, 'Title3', 'Category3');
    service.createPost(newPost).subscribe((post) => {
      expect(post).toEqual(newPost);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush(newPost);
  });

  it('should update a post by ID', () => {
    const updatedPost = new Post('UpdatedAuthor', 'UpdatedContent', new Date('2023-11-04'), false, 'UpdatedTitle', 'UpdatedCategory');
    service.updatePost(1, updatedPost).subscribe((response) => {
      expect(response).toBeNull(); 
    });
  
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
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
    const filteredPosts = [mockPosts[0]];

    service.filterPublishedPosts(filter).subscribe((posts) => {
      expect(posts).toEqual(filteredPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should filter concept posts based on criteria', () => {
    const filter: Filter = { content: 'Content2', author: 'Author2', datePublished: new Date('2023-11-02') };
    const filteredPosts = [mockPosts[1]];

    service.filterConceptPosts(filter).subscribe((posts) => {
      expect(posts).toEqual(filteredPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/concept`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
