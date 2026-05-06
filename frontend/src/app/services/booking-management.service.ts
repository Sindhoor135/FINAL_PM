import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking.model';
import { AuthService } from './auth.service';

/**
 * BookingManagementService - Handles booking-specific operations
 * Manages parcel bookings for customers
 */
@Injectable({
  providedIn: 'root'
})
export class BookingManagementService {
  private apiUrl = 'http://localhost:8080/api/customer/book';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Book a new parcel
   * @param bookingData - The booking request data
   * @returns Observable of the booking response
   */
  bookParcel(bookingData: BookingRequest): Observable<BookingResponse> {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    const token = this.authService.getAuthToken() || authResponse.token || '';
    const userId = authResponse.userId || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<BookingResponse>(
      `${this.apiUrl}/${userId}`,
      bookingData,
      { headers }
    );
  }
}
