import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailPostComponent } from './detail-post.component';
import { of } from 'rxjs';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../shared/services/auth.service';
import { ReviewService } from '../shared/services/review.service';
import { CommentService } from '../shared/services/comment.service';
import { FormBuilder } from '@angular/forms';
import { Comment } from '../shared/models/comment.model';

describe('DetailPostComponent', () => {
  let component: DetailPostComponent;
  let fixture: ComponentFixture<DetailPostComponent>;

  const activatedRouteMock = {
    snapshot: {
      params: { id: 1 }
    }
  };

  const postServiceMock = {
    getPostById: jasmine.createSpy().and.returnValue(of({ id: 1, title: 'Test Post' })),
    publishPost: jasmine.createSpy().and.returnValue(of({})),
  };

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy().and.returnValue({ username: 'testuser', id: 1, role: 'Redacteur' }),
    getRole: jasmine.createSpy().and.returnValue('Redacteur'),
  };

  const reviewServiceMock = {
    getReviewsById: jasmine.createSpy().and.returnValue(of([])),
    approvePost: jasmine.createSpy().and.returnValue(of({})),
    rejectPost: jasmine.createSpy().and.returnValue(of({})),
  };

  const commentServiceMock = {
    getCommentsById: jasmine.createSpy().and.returnValue(of([])),
    createComment: jasmine.createSpy().and.returnValue(of({})),
    updateComment: jasmine.createSpy().and.returnValue(of({})),
    deleteComment: jasmine.createSpy().and.returnValue(of({})),
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPostComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: Router, useValue: routerMock },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPostComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  
  });

  it('should fetch post data on init if user is logged in', () => {
    component.ngOnInit();
    expect(postServiceMock.getPostById).toHaveBeenCalledWith(1, 'testuser', 1, 'Redacteur');
  });

  it('should fetch post data on init if no user is logged in', () => {
    authServiceMock.getCurrentUser.and.returnValue(null);
    component.ngOnInit();
    expect(postServiceMock.getPostById).toHaveBeenCalledWith(1);
  });

  it('should approve the post', () => {
    component.approvePost();
    expect(reviewServiceMock.approvePost).toHaveBeenCalledWith(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/submitted-posts']);
  });

  it('should reject the post if feedback form is valid', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.feedbackForm.setValue({ feedback: 'Test feedback' });
    component.rejectPost();
    expect(reviewServiceMock.rejectPost).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/submitted-posts']);
  });

  it('should not reject the post if feedback form is invalid', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.feedbackForm.setValue({ feedback: '' });
    component.rejectPost();
    expect(reviewServiceMock.rejectPost).toHaveBeenCalled();
  });

  it('should publish the post', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.publishPost();
    expect(postServiceMock.publishPost).toHaveBeenCalledWith(1, 'testuser', 1, 'Redacteur');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });


  it('should toggle comment form visibility', () => {
    expect(component.showCommentForm).toBeFalse();
    component.toggleCommentForm();
    expect(component.showCommentForm).toBeTrue();
    component.toggleCommentForm();
    expect(component.showCommentForm).toBeFalse();
  });

  it('should not submit a comment if form is invalid', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.commentForm.setValue({ comment: '' });
    component.submitComment();
    expect(commentServiceMock.createComment).not.toHaveBeenCalled();
  });

  it('should not submit a comment if form is invalid', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.commentForm.setValue({ comment: '' });
    component.submitComment();
    expect(commentServiceMock.createComment).not.toHaveBeenCalled();
  });

  it('should enable comment edit', () => {
    const comment = { id: 1, postId: 1, text: 'Test comment', dateCreated: new Date(), commenter: 'Commenter', commenterId: 1 };
    component.enableEditComment(comment);
    expect(component.editCommentId).toBe(1);
    expect(component.editCommentForm.value.text).toBe('Test comment');
  });

  it('should cancel comment edit', () => {
    component.cancelEdit();
    expect(component.editCommentId).toBeNull();
    expect(component.editCommentForm.value.text).toBe(null);
  });

  it('should update the comment', () => {
    component.user = { username: 'testuser', password: 'azerty', id: 1, role: 'Redacteur' };
    component.editCommentForm.setValue({ text: 'Updated comment' });
    component.updateComment(1);
    expect(commentServiceMock.updateComment).toHaveBeenCalledWith(1, { postId: 1, text: 'Updated comment' }, 'testuser', 1, 'Redacteur');
  });

  it('should delete a comment', () => {
    component.deleteComment(1);
    expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(1, 'testuser', 1, 'Redacteur');
  });
});