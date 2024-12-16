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

  getAllPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(this.api);
  }

  getAllPublishedPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/published`);
  }

  getAllSubmittedPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/submitted`);
  }

  createPost(post: Post, author: string, authorId: number): Observable<Post> {
    return this.http.post<Post>(this.api, post, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'author': author,
        'authorId': authorId.toString(),
      }),
    });
  }

  updatePost(id: number, post: Post, author: string, authorId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, post, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'author': author,
        'authorId': authorId.toString(),
      }),
    });
  }

  publishPost(id: number, authorId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/publish`, null, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorId': authorId.toString(),
        }),
    });
  }

  getPostById(id: number): Observable<Post>{
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  getPostsByAuthorIdAndStatus(authorId: number, postStatus: PostStatus): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/filter/${postStatus}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorId': authorId.toString(),
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

  filterConceptPosts(filter: Filter, authorId: number): Observable<Post[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorId': authorId.toString(),
    });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.CONCEPT}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterApprovedPosts(filter: Filter, authorId: number): Observable<Post[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorId': authorId.toString(),
    });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.APPROVED}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterRejectedPosts(filter: Filter, authorId: number): Observable<Post[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorId': authorId.toString(),
    });

    return this.http.get<Post[]>(`${this.api}/post/filter/${PostStatus.REJECTED}`, { headers }).pipe(
      map((posts: Post[]) => 
        posts.filter(post => this.isPostMatchingFilter(post, filter))
      )
    );
  }

  filterSubmittedPosts(filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/submitted`).pipe(
        map((post: Post[]) => post.filter(post => this.isPostMatchingFilter(post, filter)))
    );
  }
}
