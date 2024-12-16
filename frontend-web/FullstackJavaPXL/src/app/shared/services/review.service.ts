import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { AddReview } from '../models/addReview.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api: string = environment.apiUrl + 'review/api/review';
  private http: HttpClient = inject(HttpClient);

  getReviewsById(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}/${id}`);
  }

  approvePost(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/approve`, {}
    );
  }

  rejectPost(id: number, reviewer: string, reviewerId: number, reviewRequest: AddReview): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/reject`, reviewRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'reviewer': reviewer,
        'reviewerId': reviewerId.toString(),
      }),
    });
  }
}