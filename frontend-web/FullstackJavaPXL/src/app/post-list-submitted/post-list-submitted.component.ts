import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFilterComponent } from '../post-filter/post-filter.component';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-post-list-submitted',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-list-submitted.component.html',
  styleUrl: './post-list-submitted.component.css'
})
export class PostListSubmittedComponent implements OnInit{
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  posts: Post[] = [];
  user: User | null | undefined;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.postService.getAllSubmittedPosts(this.user!.username, this.user!.id, this.user!.role).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: Filter): void {
    this.postService.filterSubmittedPosts(this.user!.username, this.user!.id, this.user!.role, filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
