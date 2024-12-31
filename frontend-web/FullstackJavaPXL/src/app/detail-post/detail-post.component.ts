import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../shared/models/post.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { ReviewService } from '../shared/services/review.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { AddReview } from '../shared/models/addReview.model';
import { Review } from '../shared/models/review.model';
import { CommentService } from '../shared/services/comment.service';
import { Comment } from '../shared/models/comment.model';
import { MatIconModule } from '@angular/material/icon';
import { AddComment } from '../shared/models/addComment.model';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.css'
})
export class DetailPostComponent implements OnInit , OnDestroy{
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  sub!: Subscription;

  authService: AuthService = inject(AuthService);
  reviewService: ReviewService = inject(ReviewService);
  commentService: CommentService = inject(CommentService);
  router: Router = inject(Router);

  post$: Observable<Post> | undefined;
  reviews$: Observable<Review[]> = this.reviewService.getReviewsById(this.id);
  comments$: Observable<Comment[]> = this.commentService.getCommentsById(this.id);

  user: User | null | undefined;

  fb: FormBuilder = inject(FormBuilder);

  feedbackForm: FormGroup = this.fb.group({
    feedback: [''],
  });

  commentForm: FormGroup = this.fb.group({
    comment: ['', Validators.required],
  });

  showCommentForm: boolean = false;

  editCommentForm: FormGroup = this.fb.group({
    text: ['', Validators.required],
  });
  editCommentId: number | null = null;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user){
      this.post$ = this.postService.getPostById(this.id, this.user!.username, this.user!.id, this.user!.role);
    }
    else{
      this.post$ = this.postService.getPostById(this.id);
    }

    this.sub = this.reviews$.subscribe(reviews => {
    });
    this.sub = this.comments$.subscribe(comments => {
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  approvePost(): void {
    this.reviewService.approvePost(this.id).subscribe(() => {
      this.router.navigate(['/submitted-posts']);
    });
  }

  rejectPost(): void {
    if (this.feedbackForm.valid) {
      const feedback = this.feedbackForm.value.feedback;
      const reviewer = this.user!.username; 
      const reviewerId = this.user!.id;
      const role = this.user!.role;

      const reviewRequest: AddReview = {
        postId: this.id, 
        feedback: feedback, 
      };

      this.reviewService.rejectPost(this.id, reviewer, reviewerId, role, reviewRequest).subscribe(() => {
        this.router.navigate(['/submitted-posts']);
      });
    }
  }

  publishPost(): void {
    this.postService.publishPost(this.id, this.user!.username, this.user!.id, this.user!.role).subscribe(() => {
      this.router.navigate(['/posts']);
    });
  }
  
  isRedacteur(): boolean {
    return this.authService.getRole() === 'Redacteur';
  }

  hasRole() : boolean {
    if (this.authService.getRole() !== "" && this.authService.getRole() !== null){
      return true;
    }
    return false;
  }

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  submitComment(): void {
    if (this.commentForm.valid && this.user) {
      const commentRequest: AddComment = {
        postId: this.id,
        text: this.commentForm.value.comment,
      };

      this.commentService
        .createComment(commentRequest, this.user.username, this.user.id, this.user.role)
        .subscribe(() => {
          this.comments$ = this.commentService.getCommentsById(this.id);
          this.commentForm.reset();
          this.showCommentForm = false;
        }
      );
    }
  }

  enableEditComment(comment: Comment): void {
    this.editCommentId = comment.id;
    this.editCommentForm.setValue({ text: comment.text });
  }

  cancelEdit(): void {
    this.editCommentId = null;
    this.editCommentForm.reset();
  }

  updateComment(commentId: number): void {
    if (this.editCommentForm.valid && this.user) {
      const updatedComment: AddComment = {
        postId: this.id,
        text: this.editCommentForm.value.text,
      };

      this.commentService
        .updateComment(commentId, updatedComment, this.user.username, this.user.id, this.user.role)
        .subscribe(() => {
          this.comments$ = this.commentService.getCommentsById(this.id); 
          this.editCommentId = null;
        });
    }
  }

  deleteComment(commentId: number): void {
    if (this.user) {
      this.commentService
        .deleteComment(commentId, this.user.username, this.user.id, this.user.role)
        .subscribe(() => {
          this.comments$ = this.commentService.getCommentsById(this.id); 
        });
    }
  }
}
