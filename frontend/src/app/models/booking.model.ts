/**
 * Booking Models
 */

export interface BookingRequest {
  receiverName: string;
  senderName?:string;
  deliveryAddress: string;
  receiverPin: string;
  receiverMobile: string;
  weight: number;
  deliveryType: string;
  packingType: string;
  cost: number;
  pickupTime: string;
  dropTime?: string;
}

export interface BookingResponse {
  [key: string]: any;
}

export interface BookingData {
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
}
