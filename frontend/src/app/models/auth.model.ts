/**
 * Authentication Models
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: any;
  userId?: number;
  message?: string;
  [key: string]: any;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  mobile: string;
  address: string;
  role: string;
}

export interface RegisterResponse {
  message?: string;
  user?: any;
  [key: string]: any;
}

export interface LogoutRequest {
  token?: string;
}

export interface LogoutResponse {
  message?: string;
  [key: string]: any;
}
