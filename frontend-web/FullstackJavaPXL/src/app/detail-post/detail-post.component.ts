import { Component, inject, OnDestroy } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../shared/models/post.model';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.css'
})
export class DetailPostComponent implements OnDestroy{
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  sub!: Subscription;

  post$: Observable<Post> = this.postService.getPostById(this.id);

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
