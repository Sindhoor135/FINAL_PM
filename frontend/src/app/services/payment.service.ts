import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse, InvoiceData } from '../models/payment.model';
import { AuthService } from './auth.service';

/**
 * PaymentService - Handles all payment-related API operations
 * Manages payment processing and transactions
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payment/pay';
  private statusUrl = 'http://localhost:8080/api/payment/status';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Process payment for a booking
   * @param paymentData - The payment request data
   * @param paymentId - The payment ID or booking ID
   * @returns Observable of the payment response
   */
  processPayment(paymentData: PaymentRequest, paymentId: string): Observable<PaymentResponse> {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    const token = this.authService.getAuthToken() || authResponse.token || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/${paymentId}`,
      paymentData,
      { headers }
    );
  }

  /**
   * Get payment status for a parcel
   * @param parcelId - The parcel ID
   * @returns Observable of the payment status response
   */
  getPaymentStatus(parcelId: number): Observable<any> {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    const token = this.authService.getAuthToken() || authResponse.token || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `${this.statusUrl}/${parcelId}`,
      { headers }
    );
  }
}
