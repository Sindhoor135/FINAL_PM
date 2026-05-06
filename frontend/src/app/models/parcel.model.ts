/**
 * Parcel Models
 */

export interface Sender {
  id?: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
}

export interface Parcel {
  id?: string | number;
  trackingNumber: string;
  trackingId?: string;
  receiverName: string;
  deliveryAddress: string;
  receiverPin: string;
  receiverMobile: string;
  weight: number;
  deliveryType: string;
  packingType: string;
  cost: number;
  pickupTime: string;
  dropTime: string;
  status?: string;
  sender?: Sender;
  createdAt?: string;
  [key: string]: any;
}

export interface ParcelStatusUpdateRequest {
  status: string;
}

export interface ParcelTimingUpdateRequest {
  pickupTime: string;
  dropTime: string;
}

export interface ParcelStatusUpdateResponse {
  message?: string;
  [key: string]: any;
}

export interface ParcelTimingUpdateResponse {
  message?: string;
  [key: string]: any;
}

export interface ParcelsListResponse {
  parcels: Parcel[];
  [key: string]: any;
}
