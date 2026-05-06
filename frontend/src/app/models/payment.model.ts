/**
 * Payment Models
 */

export interface PaymentRequest {
  method: string;
  number: string;
  cvv: string;
  expiry: string;
}

export interface PaymentResponse {
  message?: string;
  transactionId?: string;
  status?: string;
  [key: string]: any;
}

export interface InvoiceParcel {
  id?: string | number;
  trackingNumber?: string;
  receiverName?: string;
  receiverMobile?: string;
  weight?: number;
  deliveryType?: string;
  packingType?: string;
  cost?: number;
  sender?: any;
}

export interface InvoiceData {
  id?: string | number;
  invoiceNumber?: string;
  bookingId?: string;
  amount?: number;
  paymentStatus?: string;
  transactionId?: string;
  timestamp?: string;
  paidAt?: string;
  paymentMethod?: string;
  parcel?: InvoiceParcel;
  [key: string]: any;
}
