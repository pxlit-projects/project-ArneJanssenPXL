import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';

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

  getPostById(id: number): Observable<Post>{
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  private isPostMatchingFilter(post: Post, filter: Filter){
    const matchesContent = post.content.toLowerCase().includes(filter.content.toLowerCase());
    const matchesAuthor = post.author.toLowerCase().includes(filter.author.toLowerCase());
    const matchesDatePublished =
    !filter.datePublished || 
    new Date(post.datePublished).toDateString() === filter.datePublished.toDateString();

    return matchesContent && matchesAuthor && matchesDatePublished;
  }

  filterPosts(filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(this.api).pipe(
        map((post: Post[]) => post.filter(post => this.isPostMatchingFilter(post, filter)))
    );
}
}
