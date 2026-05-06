# MVC Structure Implementation for PMS Angular Application

## Overview
This document describes the reorganized MVC (Model-View-Controller) structure of the Parcel Management System (PMS) Angular application.

## Architecture

### Models Layer (`/src/app/models/`)
Defines all data structures and interfaces for type safety.

#### Files:
- **auth.model.ts** - Authentication related interfaces
  - `LoginRequest` - User login credentials
  - `LoginResponse` - Login response with token and user data
  - `RegisterRequest` - User registration data
  - `RegisterResponse` - Registration response
  - `LogoutRequest` & `LogoutResponse` - Logout operations

- **booking.model.ts** - Booking related interfaces
  - `BookingRequest` - Parcel booking request data
  - `BookingResponse` - Booking response
  - `BookingData` - Complete booking data structure

- **parcel.model.ts** - Parcel operations interfaces
  - `Parcel` - Complete parcel object
  - `ParcelStatusUpdateRequest` - Status update request
  - `ParcelStatusUpdateResponse` - Status update response
  - `ParcelTimingUpdateRequest` - Timing update request
  - `ParcelTimingUpdateResponse` - Timing update response
  - `ParcelsListResponse` - List of parcels response

- **feedback.model.ts** - Feedback related interfaces
  - `Feedback` - Feedback object structure
  - `FeedbackRequest` - Feedback submission data
  - `FeedbackResponse` - Feedback response
  - `FeedbackListResponse` - List of feedbacks response

- **payment.model.ts** - Payment related interfaces
  - `PaymentRequest` - Payment submission data
  - `PaymentResponse` - Payment response
  - `InvoiceData` - Invoice information

### Services Layer (`/src/app/services/`)
Encapsulates all API calls and business logic. Each service is responsible for a specific domain.

#### Services:

**1. auth.service.ts** - Authentication Management
```typescript
- login(credentials: LoginRequest): Observable<LoginResponse>
- register(formData: RegisterRequest): Observable<RegisterResponse>
- logoutAPI(): Observable<LogoutResponse>
- logout(): void
- getAuthResponse(): LoginResponse | null
- getAuthToken(): string | null
- isLoggedIn(): boolean
```

**2. parcel.service.ts** - Parcel Management (NEW)
```typescript
- getCustomerParcels(userId: number): Observable<any>
- getAllParcels(): Observable<any>
- updateParcelStatus(trackingId: string, status: string): Observable<ParcelStatusUpdateResponse>
- updateParcelTimings(trackingId: string, updateData: ParcelTimingUpdateRequest): Observable<ParcelTimingUpdateResponse>
- cancelParcel(trackingNumber: string): Observable<any>
```

**3. feedback.service.ts** - Feedback Management (NEW)
```typescript
- getAllFeedback(): Observable<any>
- submitFeedback(userId: number, trackingNumber: string, feedbackData: FeedbackRequest): Observable<FeedbackResponse>
```

**4. booking-management.service.ts** - Booking Operations (NEW)
```typescript
- bookParcel(bookingData: BookingRequest): Observable<BookingResponse>
```

**5. payment.service.ts** - Payment Processing (NEW)
```typescript
- processPayment(paymentData: PaymentRequest, paymentId: string): Observable<PaymentResponse>
```

**6. booking.service.ts** - Legacy Service (Deprecated)
Maintained for backward compatibility. Delegates to ParcelService and PaymentService.

### Views Layer (`/src/app/pages/` and `/src/app/components/`)
Angular components that handle UI presentation and user interaction.

#### Customer Pages:
- **list-parcel.component.ts** - Updated to use ParcelService and FeedbackService
- **booking-service.component.ts** - Updated to use BookingManagementService
- **home.component.ts** - Landing page
- **contact.component.ts** - Contact page

#### Officer Pages:
- **list-parcel.component.ts** - Updated to use ParcelService for admin panel
- **view-feedback.component.ts** - Updated to use FeedbackService

#### Other Pages:
- **login.component.ts** - Uses AuthService
- **register.component.ts** - Uses AuthService
- **payment.component.ts** - Updated to use PaymentService

## API Endpoints Centralization

All API endpoints are now centralized in respective services:

| Domain | Endpoint | Service |
|--------|----------|---------|
| Authentication | `http://localhost:8080/api/auth/*` | auth.service.ts |
| Parcel Management | `http://localhost:8080/api/customer/my-parcels/*` | parcel.service.ts |
| Parcel Admin | `http://localhost:8080/api/admin/*` | parcel.service.ts |
| Feedback | `http://localhost:8080/api/feedback/*` | feedback.service.ts |
| Booking | `http://localhost:8080/api/customer/book/*` | booking-management.service.ts |
| Payment | `http://localhost:8080/api/payment/pay/*` | payment.service.ts |

## Benefits of This Structure

1. **Separation of Concerns** - Models, Services, and Views are clearly separated
2. **Reusability** - Services can be injected into multiple components
3. **Maintainability** - API logic is centralized making updates easier
4. **Type Safety** - Strong typing with TypeScript interfaces
5. **Scalability** - Easy to add new features and services
6. **Testing** - Services can be mocked and tested independently
7. **Documentation** - Clear JSDoc comments in all service methods

## Migration Guide

### Before (Direct HTTP calls in components):
```typescript
constructor(private http: HttpClient) {}

getParcels() {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  this.http.get('http://localhost:8080/api/customer/my-parcels/${userId}', { headers })
    .subscribe((response) => {
      this.parcels = response;
    });
}
```

### After (Using Service layer):
```typescript
constructor(private parcelService: ParcelService) {}

getParcels() {
  this.parcelService.getCustomerParcels(this.userId)
    .subscribe({
      next: (response) => {
        this.parcels = response;
      },
      error: (error) => {
        console.error('Error fetching parcels:', error);
      }
    });
}
```

## Updated Components

The following components have been updated to use the new service structure:

- ✅ `list-parcel.component.ts` (Customer)
- ✅ `list-parcel.component.ts` (Officer)
- ✅ `view-feedback.component.ts`
- ✅ `booking-service.component.ts`
- ✅ `payment.component.ts`

## Best Practices Applied

1. **HTTP Header Management** - All authentication headers handled in services
2. **Error Handling** - Components implement proper error handling with try-catch or error callbacks
3. **Type Definitions** - All API requests/responses are strongly typed
4. **Observable Pattern** - Using RxJS observables for async operations
5. **Method Documentation** - JSDoc comments for all public methods
6. **Lazy Loading** - Services are provided at root level for singleton pattern

## Future Enhancements

1. Add HTTP interceptor for automatic token injection
2. Implement error handling interceptor for global error management
3. Add caching mechanism for frequently accessed data
4. Implement state management (NgRx) for complex state
5. Add request/response logging service
6. Implement retry logic with exponential backoff

## File Structure Overview

```
src/app/
├── models/
│   ├── index.ts (central export)
│   ├── auth.model.ts
│   ├── booking.model.ts
│   ├── parcel.model.ts
│   ├── feedback.model.ts
│   └── payment.model.ts
├── services/
│   ├── auth.service.ts (updated)
│   ├── booking.service.ts (legacy, deprecated)
│   ├── parcel.service.ts (NEW)
│   ├── feedback.service.ts (NEW)
│   ├── booking-management.service.ts (NEW)
│   └── payment.service.ts (NEW)
├── pages/
│   ├── customerpages/
│   │   ├── list-parcel/ (updated)
│   │   ├── booking-service/ (updated)
│   │   └── ...
│   ├── officerpages/
│   │   ├── list-parcel/ (updated)
│   │   ├── view-feedback/ (updated)
│   │   └── ...
│   └── ...
└── ...
```

## Configuration Notes

- All API endpoints point to `http://localhost:8080`
- Authentication uses Bearer token pattern
- Services handle token extraction from localStorage
- All services are provided at root level (singleton pattern)

---

**Last Updated:** January 28, 2026
**Version:** 1.0
**Status:** Complete
