import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from '../shared/models/post.model';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit{
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  user: User | null | undefined;
  errorMessage: string = '';

  post$: Observable<Post> = this.postService.getPostById(this.id);

  updateForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    category: ['', Validators.required],
    postStatus: ['', Validators.required]
  });

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    if (this.user!.role !== 'Redacteur') {
      this.router.navigate(['/posts']);
    }

    this.post$.subscribe((post) => {
      this.updateForm.patchValue({
        title: post.title,
        content: post.content,
        category: post.category,
        postStatus: post.postStatus
      });
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
        const updatedPost: Post = { ...this.updateForm.value };
        this.postService.updatePost(this.id, updatedPost, this.user!.username, this.user!.id).subscribe({
            next: () => {
                this.updateForm.reset();
                this.router.navigate(['/posts']);
            },
            error: (error) => {
                if (error.status === 403) {
                    this.errorMessage = "Je hebt niet de juiste rechten."
                } 
                else {
                    this.errorMessage = "Er is een fout opgetreden bij het bijwerken van het bericht. Probeer het opnieuw."
                }
            }
        });
    } 
    else {
      this.errorMessage = "Form is onjuist. Controlleer alle velden.";
    }
  }
}
