import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit{
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];

  post$: Observable<Post> = this.postService.getPostById(this.id);

  updateForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    datePublished: [new Date().toISOString()],
    concept: [false]
  });

  ngOnInit(): void {
    this.post$.subscribe((post) => {
      this.updateForm.patchValue({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        concept: post.isConcept
      });
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const updatedPost: Post = { ...this.updateForm.value };
      this.postService.updatePost(this.id, updatedPost).subscribe(() => {
        this.updateForm.reset();
        this.router.navigate(['/posts']); 
      });
    }
  }
}
