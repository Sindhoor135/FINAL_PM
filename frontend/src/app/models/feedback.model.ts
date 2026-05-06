/**
 * Feedback Models
 */

export interface FeedbackRequest {
  rating: number;
  comment: string;
}

export interface FeedbackUser {
  id?: number;
  fullName: string;
  email: string;
}

export interface FeedbackParcel {
  id?: string | number;
  trackingNumber: string;
  status?: string;
  sender?: any;
  receiverName?: string;
  deliveryType?: string;
  cost?: number;
}

export interface Feedback {
  id?: number;
  userId: number;
  trackingNumber: string;
  rating: number;
  comment: string;
  createdAt?: string;
  user?: FeedbackUser;
  parcel?: FeedbackParcel;
  [key: string]: any;
}

export interface FeedbackResponse {
  message?: string;
  [key: string]: any;
}

export interface FeedbackListResponse {
  feedbacks: Feedback[];
  [key: string]: any;
}
