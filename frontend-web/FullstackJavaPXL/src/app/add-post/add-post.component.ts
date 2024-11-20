import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../shared/services/post.service';
import { Router } from '@angular/router';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule,],
  providers: [PostService],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    datePublished: [new Date().toISOString()],
    concept: [false]
  });

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = { ...this.postForm.value };
      this.postService.createPost(newPost).subscribe(() => {
        this.postForm.reset();
        this.router.navigate(['/home']);
      });
    }
  }
}
