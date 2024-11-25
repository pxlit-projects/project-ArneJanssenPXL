import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Filter } from '../shared/models/filter.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFilterComponent } from '../post-filter/post-filter.component';

@Component({
  selector: 'app-post-list-concept',
  standalone: true,
  imports: [PostItemComponent, PostFilterComponent],
  templateUrl: './post-list-concept.component.html',
  styleUrl: './post-list-concept.component.css'
})
export class PostListConceptComponent implements OnInit{
  postService: PostService = inject(PostService);
  posts: Post[] = [];

  ngOnInit(): void {
    this.postService.getAllConceptPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: Filter): void {
    this.postService.filterConceptPosts(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
