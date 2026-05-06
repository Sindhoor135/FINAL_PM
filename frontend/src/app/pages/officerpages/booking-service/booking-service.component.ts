import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-service',
  templateUrl: './booking-service.component.html',
  styleUrls: ['./booking-service.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class OBookingServiceComponent implements OnInit {
  bookingForm!: FormGroup;
  submitted: boolean = false;
  serviceCost: number = 0;
  isSameDayMode: boolean = false;

  constructor(private fb: FormBuilder, private bookingService: BookingService, private router: Router) {}

  private noRepeatedDigitsValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const value = control.value.toString();
    if (value.length !== 10) return null; // Already checked by pattern
    const firstDigit = value[0];
    if (value.split('').every((digit: string) => digit === firstDigit)) {
      return { repeatedDigits: true };
    }
    return null;
  };

  private futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  };

  private dropDateAfterPickupValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const dropDate = new Date(control.value);
    const pickupControl = this.bookingForm?.get('pickupTime');
    if (!pickupControl?.value) return null;
    const pickupDate = new Date(pickupControl.value);
    if (dropDate <= pickupDate) {
      return { dropBeforePickup: true };
    }
    return null;
  };

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      receiverName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      senderName:['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      deliveryAddress: ['', Validators.required],
      receiverPin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      receiverMobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/), this.noRepeatedDigitsValidator]],
      parcelWeight: [0, [Validators.required, Validators.min(0.01)]],
      parcelContents: ['', Validators.required],
      deliveryType: ['standard', Validators.required],
      packingPreference: ['basic', Validators.required],
      pickupTime: ['', [Validators.required, this.futureDateValidator]],
      dropTime: ['', [Validators.required, this.futureDateValidator, this.dropDateAfterPickupValidator.bind(this)]]
    });

    // Subscribe to delivery type changes
    this.bookingForm.get('deliveryType')?.valueChanges.subscribe((value) => {
      if (value === 'same-day') {
        this.isSameDayMode = true;
        const today = this.getTodayDateString();
        this.bookingForm.patchValue({
          pickupTime: today,
          dropTime: today
        });
        this.bookingForm.get('pickupTime')?.disable();
        this.bookingForm.get('dropTime')?.disable();
      } else {
        this.isSameDayMode = false;
        this.bookingForm.get('pickupTime')?.enable();
        this.bookingForm.get('dropTime')?.enable();
        this.bookingForm.get('pickupTime')?.updateValueAndValidity();
        this.bookingForm.get('dropTime')?.updateValueAndValidity();
      }
    });

    // Subscribe to pickup time changes to validate dropoff time
    this.bookingForm.get('pickupTime')?.valueChanges.subscribe(() => {
      this.bookingForm.get('dropTime')?.updateValueAndValidity();
    });

    // Subscribe to value changes to recalculate cost
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateServiceCost();
    });
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateServiceCost(): number {
    const parcelWeight = this.bookingForm.get('parcelWeight')?.value || 0;
    const deliveryType = this.bookingForm.get('deliveryType')?.value;
    const packingPreference = this.bookingForm.get('packingPreference')?.value;

    const baseRate = 50;
    const weightCharge = parcelWeight * 0.02;
    const deliveryCharge = this.getDeliveryCharge(deliveryType);
    const packingCharge = this.getPackingCharge(packingPreference);
    const subtotal = baseRate + weightCharge + deliveryCharge + packingCharge;
    const tax = subtotal * 0.05;

    this.serviceCost = subtotal + tax;
    return this.serviceCost;
  }

  getDeliveryCharge(deliveryType: string): number {
    switch (deliveryType) {
      case 'standard': return 30;
      case 'express': return 80;
      case 'same-day': return 150;
      default: return 0;
    }
  }

  getPackingCharge(packingPreference: string): number {
    return packingPreference === 'premium' ? 30 : 10;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.serviceCost = this.calculateServiceCost();
    const formValue = this.bookingForm.getRawValue(); // getRawValue includes disabled controls
    const bookingData = {
      receiverName: formValue.receiverName,
      senderName:formValue.senderName,
      deliveryAddress: formValue.deliveryAddress,
      receiverPin: formValue.receiverPin,
      receiverMobile: formValue.receiverMobile,
      weight: formValue.parcelWeight,
      deliveryType: formValue.deliveryType,
      packingType: formValue.packingPreference,
      cost: this.serviceCost,
      pickupTime: formValue.pickupTime,
      dropTime: formValue.dropTime
    };

    this.bookingService.bookParcel(bookingData)
      .subscribe(response => {
        console.log('Booking successful', response);
        // Navigate to payment page with booking data
        const bookingId = response['bookingId'] || response['id'];
        this.router.navigate(['/officer/payment', bookingId], {
          state: { bookingData: bookingData, bookingId: bookingId }
        });
      }, error => {
        console.error('Booking failed', error);
      });
  }
}
