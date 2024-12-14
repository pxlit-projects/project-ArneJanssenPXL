import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFilterComponent } from '../post-filter/post-filter.component';
import { PostStatus } from '../shared/models/postStatus.model';

@Component({
  selector: 'app-post-concept-list',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-concept-list.component.html',
  styleUrl: './post-concept-list.component.css'
})
export class PostConceptListComponent implements OnInit{
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  posts: Post[] = [];
  user: User | null | undefined;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.postService.getPostsByAuthorIdAndStatus(this.user!.id, PostStatus.CONCEPT).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: Filter): void {
    this.postService.filterConceptPosts(filter, this.user!.id).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
