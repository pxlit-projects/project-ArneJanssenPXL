import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddPostComponent } from './add-post/add-post.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent }, 
    { path: 'home', component: WelcomeComponent }, 
    { path: 'add-post', component: AddPostComponent }, 
    { path: 'login', component: LoginComponent }
];
