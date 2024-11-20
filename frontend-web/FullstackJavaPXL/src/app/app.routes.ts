import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddPostComponent } from './add-post/add-post.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { UpdatePostComponent } from './update-post/update-post.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent }, 
    { path: 'home', component: WelcomeComponent }, 
    { path: 'add-post', component: AddPostComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'post/:id', component: DetailPostComponent},
    { path: 'posts', component: PostListComponent},
    { path: 'update-post/:id', component: UpdatePostComponent}
];
