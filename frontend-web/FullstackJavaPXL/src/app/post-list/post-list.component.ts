import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../shared/models/post.model';
import { PostService } from '../shared/services/post.service';
import { PostItemComponent } from '../post-item/post-item.component';
import { Filter } from '../shared/models/filter.model';
import { PostFilterComponent } from '../post-filter/post-filter.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  posts: Post[] = [];

  ngOnInit(): void {
    this.postService.getAllPublishedPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Error fetching published posts:', err);
        this.posts = []; 
      },
    });
  }

  handleFilter(filter: Filter): void {
    this.postService.filterPublishedPosts(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Error filtering posts:', err);
        this.posts = [];
      },
    });
  }
}
