import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../shared/services/auth.service';
import { Post } from '../shared/models/post.model';
import { User } from '../shared/models/user.model';
import { PostStatus } from '../shared/models/postStatus.model';
import { Filter } from '../shared/models/filter.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFilterComponent } from '../post-filter/post-filter.component';

@Component({
  selector: 'app-post-rejected-list',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-rejected-list.component.html',
  styleUrl: './post-rejected-list.component.css'
})
export class PostRejectedListComponent implements OnInit{
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  posts: Post[] = [];
  user: User | null | undefined;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user){
      this.postService.getPostsByAuthorIdAndStatus(this.user!.username, this.user!.id, this.user!.role, PostStatus.REJECTED).subscribe({
        next: (posts) => {
          this.posts = posts;
        }
      });
    }
    else{
      this.posts = []
    }
  }

  handleFilter(filter: Filter): void {
    if (this.user){
      this.postService.filterRejectedPosts(filter, this.user!.username, this.user!.id, this.user!.role).subscribe({
        next: (posts) => {
          this.posts = posts;
        }
      });
    }
  }
}
