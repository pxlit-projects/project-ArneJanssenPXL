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

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, ReactiveFormsModule],
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
  router: Router = inject(Router);

  post$: Observable<Post> | undefined;
  reviews$: Observable<Review[]> = this.reviewService.getReviewsById(this.id);

  user: User | null | undefined;

  fb: FormBuilder = inject(FormBuilder);

  feedbackForm: FormGroup = this.fb.group({
    feedback: [''],
  });

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    this.post$ = this.postService.getPostById(this.id, this.user!.username, this.user!.id, this.user!.role);

    this.sub = this.reviews$.subscribe(reviews => {
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
}
