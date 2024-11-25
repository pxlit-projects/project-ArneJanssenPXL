import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddPostComponent } from './add-post/add-post.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { UpdatePostComponent } from './update-post/update-post.component';
import { confirmLeaveAddPostGuard } from './confirm-leave-add-post.guard';
import { confirmLeaveUpdatePostGuard } from './confirm-leave-update-post.guard';
import { PostListConceptComponent } from './post-list-concept/post-list-concept.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent }, 
    { path: 'home', component: WelcomeComponent }, 
    { path: 'add-post', component: AddPostComponent, canDeactivate: [confirmLeaveAddPostGuard]}, 
    { path: 'login', component: LoginComponent },
    { path: 'post/:id', component: DetailPostComponent},
    { path: 'posts', component: PostListComponent},
    { path: 'update-post/:id', component: UpdatePostComponent, canDeactivate: [confirmLeaveUpdatePostGuard]},
    { path: 'concept-posts', component: PostListConceptComponent}
];
