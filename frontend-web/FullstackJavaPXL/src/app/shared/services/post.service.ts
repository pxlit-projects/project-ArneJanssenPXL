import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';
import { PostStatus } from '../models/postStatus.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api: string = environment.apiUrl + 'post/api/post';
  private http: HttpClient = inject(HttpClient);

  /*
  getAllPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(this.api);
  }
  */

  getAllPublishedPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/published`);
  }

  getAllSubmittedPosts(username: string, userId: number, role: string): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/submitted`,  {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  createPost(post: Post, username: string, userId: number, role: string): Observable<Post> {
    return this.http.post<Post>(this.api, post, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  updatePost(id: number, post: Post, username: string, userId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, post, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  publishPost(id: number, username: string, userId: number, role: string): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/publish`, null, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'username': username,
            'userId': userId.toString(),
            'role': role
        }),
    });
  }

  getPostById(id: number, username: string, userId: number, role: string): Observable<Post>{
    return this.http.get<Post>(`${this.api}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  getPostsByAuthorIdAndStatus(username: string, userId: number, role: string, postStatus: PostStatus): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/filter/${postStatus}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  private isPostMatchingFilter(post: Post, filter: Filter){
    const matchesContent = post.content.toLowerCase().includes(filter.content.toLowerCase());
    const matchesAuthor = post.author.toLowerCase().includes(filter.author.toLowerCase());
    const matchesDatePublished =
    !filter.datePublished || 
    new Date(post.datePublished).toDateString() === filter.datePublished.toDateString();

    return matchesContent && matchesAuthor && matchesDatePublished;
  }

  filterPublishedPosts(filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/published`).pipe(
        map((post: Post[]) => post.filter(post => this.isPostMatchingFilter(post, filter)))
    );
  }

  filterConceptPosts(filter: Filter, username: string, userId: number, role: string): Observable<Post[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username,
      'userId': userId.toString(),
      'role': role
  });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.CONCEPT}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterApprovedPosts(filter: Filter, username: string, userId: number, role: string): Observable<Post[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username,
      'userId': userId.toString(),
      'role': role
  });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.APPROVED}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterRejectedPosts(filter: Filter, username: string, userId: number, role: string): Observable<Post[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
    });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.REJECTED}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterSubmittedPosts(username: string, userId: number, role: string, filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/submitted`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'author': username,
        'userId': userId.toString(),
        'role': role
      }),
    }).pipe(
      map((posts: Post[]) => posts.filter(post => this.isPostMatchingFilter(post, filter)))
    );
  }
}
