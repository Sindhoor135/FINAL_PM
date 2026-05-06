# MVC Quick Reference Guide

## Service Usage Guide

### 1. Authentication Service
```typescript
import { AuthService } from './services/auth.service';
import { LoginRequest, RegisterRequest } from './models/auth.model';

constructor(private authService: AuthService) {}

// Login
login() {
  const credentials: LoginRequest = {
    email: 'user@example.com',
    password: 'password123'
  };
  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      console.log('Login successful');
    },
    error: (error) => {
      console.error('Login failed:', error);
    }
  });
}

// Check if logged in
isLoggedIn = this.authService.isLoggedIn();

// Logout
this.authService.logout();
```

### 2. Parcel Service
```typescript
import { ParcelService } from './services/parcel.service';
import { Parcel } from './models/parcel.model';

constructor(private parcelService: ParcelService) {}

// Get customer parcels
getMyParcels(userId: number) {
  this.parcelService.getCustomerParcels(userId).subscribe({
    next: (parcels: Parcel[]) => {
      this.parcels = parcels;
    },
    error: (error) => {
      console.error('Failed to fetch parcels:', error);
    }
  });
}

// Get all parcels (admin)
getAllParcels() {
  this.parcelService.getAllParcels().subscribe({
    next: (parcels: Parcel[]) => {
      this.parcels = parcels;
    },
    error: (error) => {
      console.error('Failed to fetch all parcels:', error);
    }
  });
}

// Update parcel status
updateStatus(trackingId: string, status: string) {
  this.parcelService.updateParcelStatus(trackingId, status).subscribe({
    next: (response) => {
      console.log('Status updated');
    },
    error: (error) => {
      console.error('Failed to update status:', error);
    }
  });
}

// Update parcel timings
updateTimings(trackingId: string) {
  const updateData = {
    pickupTime: '2026-01-30T10:00:00',
    dropTime: '2026-01-30T18:00:00'
  };
  
  this.parcelService.updateParcelTimings(trackingId, updateData).subscribe({
    next: (response) => {
      console.log('Timings updated');
    },
    error: (error) => {
      console.error('Failed to update timings:', error);
    }
  });
}

// Cancel parcel
cancelParcel(trackingNumber: string) {
  this.parcelService.cancelParcel(trackingNumber).subscribe({
    next: (response) => {
      console.log('Parcel cancelled');
    },
    error: (error) => {
      console.error('Failed to cancel parcel:', error);
    }
  });
}
```

### 3. Feedback Service
```typescript
import { FeedbackService } from './services/feedback.service';
import { FeedbackRequest } from './models/feedback.model';

constructor(private feedbackService: FeedbackService) {}

// Get all feedbacks
getAllFeedbacks() {
  this.feedbackService.getAllFeedback().subscribe({
    next: (feedbacks) => {
      this.feedbacks = feedbacks;
    },
    error: (error) => {
      console.error('Failed to fetch feedbacks:', error);
    }
  });
}

// Submit feedback
submitFeedback(userId: number, trackingNumber: string) {
  const feedback: FeedbackRequest = {
    rating: 4,
    comment: 'Great service!'
  };
  
  this.feedbackService.submitFeedback(userId, trackingNumber, feedback).subscribe({
    next: (response) => {
      console.log('Feedback submitted');
    },
    error: (error) => {
      console.error('Failed to submit feedback:', error);
    }
  });
}
```

### 4. Booking Management Service
```typescript
import { BookingManagementService } from './services/booking-management.service';
import { BookingRequest } from './models/booking.model';

constructor(private bookingService: BookingManagementService) {}

// Book a parcel
bookParcel() {
  const booking: BookingRequest = {
    receiverName: 'John Doe',
    deliveryAddress: '123 Main St',
    receiverPin: '110001',
    receiverMobile: '9876543210',
    weight: 2.5,
    deliveryType: 'standard',
    packingType: 'basic',
    cost: 150,
    pickupTime: '2026-01-30T10:00:00',
    dropTime: '2026-01-30T18:00:00'
  };
  
  this.bookingService.bookParcel(booking).subscribe({
    next: (response) => {
      const bookingId = response['bookingId'];
      console.log('Booking successful, ID:', bookingId);
    },
    error: (error) => {
      console.error('Booking failed:', error);
    }
  });
}
```

### 5. Payment Service
```typescript
import { PaymentService } from './services/payment.service';
import { PaymentRequest } from './models/payment.model';

constructor(private paymentService: PaymentService) {}

// Process payment
processPayment(paymentId: string) {
  const payment: PaymentRequest = {
    method: 'CREDIT',
    number: '4532123456789010',
    cvv: '123',
    expiry: '12/25'
  };
  
  this.paymentService.processPayment(payment, paymentId).subscribe({
    next: (response) => {
      console.log('Payment successful');
      console.log('Invoice:', response);
    },
    error: (error) => {
      console.error('Payment failed:', error);
    }
  });
}
```

---

## Model Imports

```typescript
// Import individual models
import { LoginRequest, LoginResponse } from './models/auth.model';
import { BookingRequest } from './models/booking.model';
import { Parcel, ParcelStatusUpdateResponse } from './models/parcel.model';
import { Feedback, FeedbackRequest } from './models/feedback.model';
import { PaymentRequest, PaymentResponse } from './models/payment.model';

// Or use barrel export (if using index.ts)
import { LoginRequest, BookingRequest, Parcel } from './models';
```

---

## Component Dependency Injection

All services should be injected in component constructors:

```typescript
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ParcelService } from './services/parcel.service';
import { FeedbackService } from './services/feedback.service';
import { BookingManagementService } from './services/booking-management.service';
import { PaymentService } from './services/payment.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  constructor(
    private authService: AuthService,
    private parcelService: ParcelService,
    private feedbackService: FeedbackService,
    private bookingService: BookingManagementService,
    private paymentService: PaymentService
  ) {}
}
```

---

## Error Handling Pattern

All service calls should implement proper error handling:

```typescript
// Observable with error handling
this.parcelService.getAllParcels().subscribe({
  next: (data) => {
    // Handle successful response
    this.parcels = data;
    console.log('Data loaded successfully');
  },
  error: (error) => {
    // Handle error
    console.error('Error loading data:', error);
    alert('Failed to load parcels. Please try again.');
  },
  complete: () => {
    // Handle completion (optional)
    console.log('Request completed');
  }
});
```

---

## Authentication Token Management

The AuthService handles token management automatically:

```typescript
// Get token when needed
const token = this.authService.getAuthToken();

// Check if user is logged in
if (this.authService.isLoggedIn()) {
  // User is authenticated
}

// Get full auth response
const authResponse = this.authService.getAuthResponse();
console.log(authResponse.userId);
```

---

## Common Patterns

### Pattern 1: Load Data on Component Init
```typescript
ngOnInit(): void {
  this.loadParcels();
}

loadParcels(): void {
  this.parcelService.getCustomerParcels(this.userId).subscribe({
    next: (parcels) => {
      this.parcels = parcels;
    },
    error: (error) => {
      this.errorMessage = 'Failed to load parcels';
    }
  });
}
```

### Pattern 2: Submit Form and Navigate
```typescript
onSubmit(): void {
  if (this.form.invalid) return;
  
  this.bookingService.bookParcel(this.form.value).subscribe({
    next: (response) => {
      const bookingId = response['bookingId'];
      this.router.navigate(['/payment', bookingId], {
        state: { bookingData: this.form.value }
      });
    },
    error: (error) => {
      this.errorMessage = 'Booking failed';
    }
  });
}
```

### Pattern 3: Confirmation Dialog
```typescript
confirmAction(action: string): void {
  if (confirm(`Are you sure you want to ${action}?`)) {
    this.performAction();
  }
}

performAction(): void {
  this.parcelService.cancelParcel(this.trackingNumber).subscribe({
    next: (response) => {
      alert('Action completed successfully!');
      this.refresh();
    },
    error: (error) => {
      alert('Action failed. Please try again.');
    }
  });
}
```

---

## Key Points to Remember

1. **Always use services** - Never make HTTP calls directly in components
2. **Type your data** - Use interfaces from models folder
3. **Handle errors** - Always implement error callbacks
4. **Inject services** - Use constructor dependency injection
5. **Use strong typing** - Leverage TypeScript for better development experience
6. **Keep components lean** - Move logic to services
7. **Document your code** - Add comments explaining complex logic

---

**Last Updated:** January 28, 2026
