import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { AddComment } from '../models/addComment.model';
import { Comment } from '../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl + 'comment/api/comment';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });

    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommentsById', () => {
    it('should fetch comments by post ID', () => {
      const mockComments: Comment[] = [
        { id: 1, postId: 100, text: 'Great post!', dateCreated: new Date(), commenter: 'Alice', commenterId: 1 },
        { id: 2, postId: 100, text: 'Interesting read!', dateCreated: new Date(), commenter: 'Bob', commenterId: 2 },
      ];

      service.getCommentsById(100).subscribe((comments) => {
        expect(comments).toEqual(mockComments);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/100`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments); 
    });
  });

  describe('createComment', () => {
    it('should create a new comment', () => {
      const newComment: AddComment = { text: 'Awesome post!', postId: 100 };
      const createdComment: Comment = { id: 3, postId: 100, text: 'Awesome post!', dateCreated: new Date(), commenter: 'Alice', commenterId: 1 };

      service.createComment(newComment, 'Alice', 1, 'UserRole').subscribe((comment) => {
        expect(comment).toEqual(createdComment);
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newComment);
      expect(req.request.headers.get('username')).toBe('Alice');
      expect(req.request.headers.get('userId')).toBe('1');
      expect(req.request.headers.get('role')).toBe('UserRole');
      req.flush(createdComment);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment by ID', () => {
      service.deleteComment(3, 'Alice', 1, 'UserRole').subscribe((response) => {
        expect(response).toBeNull(); 
      });
  
      const req = httpTestingController.expectOne(`${apiUrl}/3`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('username')).toBe('Alice');
      expect(req.request.headers.get('userId')).toBe('1');
      expect(req.request.headers.get('role')).toBe('UserRole');
      req.flush(null); 
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment', () => {
      const updatedComment: AddComment = { text: 'Updated comment!', postId: 100 };
      const returnedComment: Comment = { id: 3, postId: 100, text: 'Updated comment!', dateCreated: new Date(), commenter: 'Alice', commenterId: 1 };

      service.updateComment(3, updatedComment, 'Alice', 1, 'UserRole').subscribe((comment) => {
        expect(comment).toEqual(returnedComment);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/3`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedComment);
      expect(req.request.headers.get('username')).toBe('Alice');
      expect(req.request.headers.get('userId')).toBe('1');
      expect(req.request.headers.get('role')).toBe('UserRole');
      req.flush(returnedComment);
    });
  });
});
