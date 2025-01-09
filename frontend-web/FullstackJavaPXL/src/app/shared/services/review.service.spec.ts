import { TestBed } from '@angular/core/testing';

import { ReviewService } from './review.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';
import { AddReview } from '../models/addReview.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl + 'review/api/review';

  const mockReviews: Review[] = [
    { id: 1, postId: 101, feedback: 'Great post!', dateCreated: new Date('2023-11-01'), reviewer: 'Reviewer1', reviewerId: '1' },
    { id: 2, postId: 102, feedback: 'Needs improvement.', dateCreated: new Date('2023-11-02'), reviewer: 'Reviewer2', reviewerId: '2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService],
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reviews by ID', () => {
    const postId = 101;

    service.getReviewsById(postId).subscribe((reviews) => {
      expect(reviews).toEqual([mockReviews[0]]);
    });

    const req = httpMock.expectOne(`${apiUrl}/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockReviews[0]]);
  });

  it('should approve a post', () => {
    const postId = 101;

    service.approvePost(postId).subscribe(() => {
      expect().nothing(); 
    });

    const req = httpMock.expectOne(`${apiUrl}/${postId}/approve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({}); 
    req.flush(null);
  });

  it('should reject a post with review request', () => {
    const postId = 102;
    const reviewer = 'Reviewer2';
    const reviewerId = 2;
    const role = 'ADMIN';
    const reviewRequest: AddReview = {
      postId: postId,
      feedback: 'The content does not meet the guidelines.',
    };

    service.rejectPost(postId, reviewer, reviewerId, role, reviewRequest).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne(`${apiUrl}/${postId}/reject`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reviewRequest);
    expect(req.request.headers.get('reviewer')).toBe(reviewer);
    expect(req.request.headers.get('reviewerId')).toBe(reviewerId.toString());
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(null); 
  });
});
