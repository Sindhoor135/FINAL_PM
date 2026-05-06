import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LogoutResponse } from '../models/auth.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  
   //User login
   
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('authResponse', JSON.stringify(response));
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
  }

  //User registration
   
  register(formData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, formData);
  }

  //User logout API call
   
  logoutAPI(): Observable<LogoutResponse> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}, { headers });
  }

  /**
   * Clear local authentication data
   */
  logout(): void {
    localStorage.removeItem('authResponse');
    localStorage.removeItem('authToken');
  }

  
   //Get stored authentication response
   
  getAuthResponse(): LoginResponse | null {
    const response = localStorage.getItem('authResponse');
    return response ? JSON.parse(response) : null;
  }

  // Get stored authentication token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is logged in
   * @returns True if user has valid token
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

