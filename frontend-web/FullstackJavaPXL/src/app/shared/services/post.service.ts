import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api: string = environment.apiUrl + 'post/api/post';
  private http: HttpClient = inject(HttpClient);

  getAllPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(this.api);
  }

  getAllConceptPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/concept`);
  }

  getAllPublishedPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/published`);
  }

  createPost(post: Post): Observable<Post>{
    return this.http.post<Post>(this.api, post);
  }

  updatePost(id: number, post: Post): Observable<void>{
    return this.http.put<void>(`${this.api}/${id}`, post);
  }
}
