import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFilterComponent } from '../post-filter/post-filter.component';

@Component({
  selector: 'app-post-list-submitted',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-list-submitted.component.html',
  styleUrl: './post-list-submitted.component.css'
})
export class PostListSubmittedComponent implements OnInit{
  postService: PostService = inject(PostService);
  posts: Post[] = [];

  ngOnInit(): void {
    this.postService.getAllSubmittedPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: Filter): void {
    this.postService.filterSubmittedPosts(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
