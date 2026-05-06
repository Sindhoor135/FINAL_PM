import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking.model';
import { PaymentRequest } from '../models/payment.model';
import { AuthService } from './auth.service';

/**
 * BookingService - Legacy service for backward compatibility
 * Delegates to ParcelService and PaymentService
 * @deprecated Use ParcelService and PaymentService instead
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/customer/book';
  private paymentUrl = 'http://localhost:8080/api/payment/pay';
  private adminUrl = 'http://localhost:8080/api/admin/update-status';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Book a new parcel
   * @param bookingData - The booking request data
   * @returns Observable of the booking response
   */
  bookParcel(bookingData: BookingRequest): Observable<BookingResponse> {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    const token = this.authService.getAuthToken() || authResponse.token || '';
    const userId = authResponse.userId || '';
    console.log(userId);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<BookingResponse>(`${this.apiUrl}/${userId}`, bookingData, { headers });
  }

  /**
   * Process payment for a booking
   * @param paymentData - The payment request data
   * @param paymentId - The payment ID or booking ID
   * @returns Observable of the payment response
   */
  processPayment(paymentData: PaymentRequest, paymentId: string): Observable<any> {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    const token = this.authService.getAuthToken() || authResponse.token || '';
    console.log(paymentData);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.paymentUrl}/${paymentId}`, paymentData, { headers });
  }

  /**
   * Update parcel status
   * @param trackingId - The tracking ID of the parcel
   * @param status - The new status
   * @param token - The authorization token
   * @returns Observable of the response
   */
  updateParcelStatus(trackingId: string, status: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.adminUrl}/${trackingId}/${status}`, {}, { headers });
  }
}
