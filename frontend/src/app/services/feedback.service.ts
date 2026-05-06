import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackRequest, FeedbackResponse, FeedbackListResponse } from '../models/feedback.model';
import { AuthService } from './auth.service';

/**
 * FeedbackService - Handles all feedback-related API operations
 * Manages customer feedback and ratings for parcels
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/api/feedback';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all feedback entries
   * @returns Observable of all feedbacks
   */
  getAllFeedback(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/all`,
      { headers }
    );
  }

  /**
   * Submit feedback for a parcel
   * @param userId - The user's ID
   * @param trackingNumber - The parcel's tracking number
   * @param feedbackData - The feedback data
   * @returns Observable of the response
   */
  submitFeedback(userId: number, trackingNumber: string, feedbackData: FeedbackRequest): Observable<FeedbackResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<FeedbackResponse>(
      `${this.apiUrl}/submit/${userId}/${trackingNumber}`,
      feedbackData,
      { headers }
    );
  }

  /**
   * Get authorization headers with bearer token
   * @returns HttpHeaders with authorization
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
