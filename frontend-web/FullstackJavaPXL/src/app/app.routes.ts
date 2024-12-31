import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddPostComponent } from './add-post/add-post.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { UpdatePostComponent } from './update-post/update-post.component';
import { confirmLeaveAddPostGuard } from './confirm-leave-add-post.guard';
import { confirmLeaveUpdatePostGuard } from './confirm-leave-update-post.guard';
import { PostListSubmittedComponent } from './post-list-submitted/post-list-submitted.component';
import { PostConceptListComponent } from './post-concept-list/post-concept-list.component';
import { PostApprovedListComponent } from './post-approved-list/post-approved-list.component';
import { PostRejectedListComponent } from './post-rejected-list/post-rejected-list.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: WelcomeComponent }, 
    { path: 'home', component: WelcomeComponent }, 
    { path: 'add-post', component: AddPostComponent, canDeactivate: [confirmLeaveAddPostGuard], canActivate: [authGuard]}, 
    { path: 'login', component: LoginComponent },
    { path: 'post/:id', component: DetailPostComponent },
    { path: 'posts', component: PostListComponent},
    { path: 'update-post/:id', component: UpdatePostComponent, canDeactivate: [confirmLeaveUpdatePostGuard], canActivate: [authGuard]},
    { path: 'submitted-posts', component: PostListSubmittedComponent, canActivate: [authGuard]},
    { path: 'concept-posts', component: PostConceptListComponent, canActivate: [authGuard]},
    { path: 'approved-posts', component: PostApprovedListComponent, canActivate: [authGuard]},
    { path: 'rejected-posts', component: PostRejectedListComponent, canActivate: [authGuard]},
];
