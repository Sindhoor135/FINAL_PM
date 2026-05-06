import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcel, ParcelStatusUpdateRequest, ParcelStatusUpdateResponse, ParcelTimingUpdateRequest, ParcelTimingUpdateResponse, ParcelsListResponse } from '../models/parcel.model';
import { AuthService } from './auth.service';

/**
 * ParcelService - Handles all parcel-related API operations
 * Manages parcel data and operations for both customers and officers
 */
@Injectable({
  providedIn: 'root'
})
export class ParcelService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all parcels for a customer
   * @param userId - The customer's user ID
   * @returns Observable of customer's parcels
   */
  getCustomerParcels(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/customer/my-parcels/${userId}`,
      { headers }
    );
  }

  /**
   * Get all parcels (admin/officer view)
   * @returns Observable of all parcels
   */
  getAllParcels(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/admin/all-parcels`,
      { headers }
    );
  }

  /**
   * Update parcel status
   * @param trackingId - The tracking ID of the parcel
   * @param status - The new status
   * @returns Observable of the response
   */
  updateParcelStatus(trackingId: string, status: string): Observable<ParcelStatusUpdateResponse> {
    const token = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<ParcelStatusUpdateResponse>(
      `${this.apiUrl}/admin/update-status/${trackingId}/${status}`,
      {},
      { headers }
    );
  }

  /**
   * Update parcel timings (pickup and drop time)
   * @param trackingId - The tracking ID of the parcel
   * @param updateData - The timing update request
   * @returns Observable of the response
   */
  updateParcelTimings(trackingId: string, updateData: ParcelTimingUpdateRequest): Observable<ParcelTimingUpdateResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<ParcelTimingUpdateResponse>(
      `${this.apiUrl}/admin/update-timings/${trackingId}`,
      updateData,
      { headers }
    );
  }

  /**
   * Cancel a parcel
   * @param trackingNumber - The tracking number of the parcel
   * @returns Observable of the response
   */
  cancelParcel(trackingNumber: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.apiUrl}/customer/update-status/${trackingNumber}/CANCELLED`,
      {},
      { headers }
    );
  }

  /**
   * Update parcel details
   * @param trackingNumber - The tracking number of the parcel
   * @param updateData - The parcel details to update
   * @returns Observable of the response
   */
  updateParcelDetails(trackingNumber: string, updateData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.apiUrl}/parcel/update-details/${trackingNumber}`,
      updateData,
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
