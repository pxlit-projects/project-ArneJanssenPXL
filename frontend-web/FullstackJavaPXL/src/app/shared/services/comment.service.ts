import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddComment } from '../models/addComment.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private api: string = environment.apiUrl + 'comment/api/comment';
  private http: HttpClient = inject(HttpClient);

  getCommentsById(id: number): Observable<Comment[]> {
      return this.http.get<Comment[]>(`${this.api}/${id}`);
  }

  createComment(commentRequest: AddComment, username: string, userId: number, role: string): Observable<Comment> {
      return this.http.post<Comment>(this.api, commentRequest, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'username': username,
          'userId': userId.toString(),
          'role': role
        }),
      }
    );
  }

  deleteComment(id: number, username: string, userId: number, role: string) : Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role
      }),
    });
  }

  updateComment(id: number, commentRequest: AddComment, username: string, userId: number, role: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.api}/${id}`, commentRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': username,
        'userId': userId.toString(),
        'role': role,
      }),
    });
  }
}
