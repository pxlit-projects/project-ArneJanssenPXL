import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../shared/services/post.service';
import { Router } from '@angular/router';
import { Post } from '../shared/models/post.model';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule,],
  providers: [PostService],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit{
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  user: User | null | undefined;

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    category: ['', Validators.required],
    postStatus: ['', Validators.required]
  });

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = { ...this.postForm.value };
      this.postService.createPost(newPost, this.user!.username, this.user!.id, this.user!.role).subscribe(() => {
        this.postForm.reset();
        this.router.navigate(['/posts']);
      });
    }
  }
}
