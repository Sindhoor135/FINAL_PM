import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PaymentRequest, InvoiceData } from '../../models/payment.model';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  bookingId: string = '';
  invoiceVisible: boolean = false;
  invoiceData: InvoiceData | null = null;
  paymentAmount: number = 0;
  paymentForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}

  private noDummyCardValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const value = control.value.toString();
    if (value.length !== 16) return null;
    const firstDigit = value[0];
    if (value.split('').every((digit: string) => digit === firstDigit)) {
      return { dummyCard: true };
    }
    return null;
  };

  private futureExpiryValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const value = control.value.toString();
    if (!/^\d{2}\/\d{2}$/.test(value)) return null;
    const [month, year] = value.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = year;
    const expiryMonth = month;
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return { pastExpiry: true };
    }
    return null;
  };

  ngOnInit(): void {
    // Get booking ID from route parameters
    this.activatedRoute.params.subscribe(params => {
      this.bookingId = params['bookingId'];
    });

    // Get payment amount from navigation state
    this.paymentAmount = (Math.floor((history.state?.bookingData?.cost || 0)*100))/100.0;

    // Initialize form
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/), this.noDummyCardValidator]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/), this.futureExpiryValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cardHolderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
    });
  }

  /**
   * Process payment submission
   */
  processPayment(): void {
    this.submitted = true;
    
    // Check if payment amount is zero
    if (this.paymentAmount <= 0) {
      this.alertService.showError('No payment required. The due amount is zero.', 'No Payment Due');
      return;
    }
    
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const formValue = this.paymentForm.value;
    const paymentData: PaymentRequest = {
      method: 'CREDIT',
      number: formValue.cardNumber,
      cvv: formValue.cvv,
      expiry: formValue.expiryDate
    };

    this.paymentService.processPayment(paymentData, this.bookingId)
      .subscribe({
        next: (response) => {
          console.log('Payment successful', response);
          // Show invoice modal with response data
          this.invoiceData = response;
          this.invoiceVisible = true;
        },
        error: (error) => {
          console.error('Payment failed', error);
          this.alertService.showError('Payment processing failed. Please try again.', 'Error');
        }
      });
  }

  /**
   * Close the invoice modal
   */
  closeInvoice(): void {
    this.invoiceVisible = false;
    this.invoiceData = null;
  }

  /**
   * Print the invoice
   */
  printInvoice(): void {
    if (!this.invoiceData) return;

    const invoice = this.invoiceData;
    const parcel = (invoice as any).parcel || {};
    const sender = parcel.sender || {};

    const content = `
      <html>
      <head>
        <title>Invoice - Payment ${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #222; margin: 0; }
          .invoice { max-width: 900px; margin: 0 auto; }
          h1 { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h3 { margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .detail { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .value { display: inline-block; }
          .total { font-weight: 700; font-size: 1.2em; color: #1a73e8; }
          @media print { body { padding: 0; margin: 0; } .invoice { max-width: none; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <h1>INVOICE</h1>
          
          <div class="section">
            <div class="detail"><span class="label">Payment ID:</span> <span class="value">${invoice.id}</span></div>
            <div class="detail"><span class="label">Paid At:</span> <span class="value">${invoice.paidAt}</span></div>
            <div class="detail"><span class="label">Payment Method:</span> <span class="value">${invoice.paymentMethod}</span></div>
            <div class="detail"><span class="label">Amount:</span> <span class="value total">₹${invoice.amount}</span></div>
          </div>

          <h3>Parcel Information</h3>
          <div class="section">
            <div class="detail"><span class="label">Tracking Number:</span> <span class="value">${parcel.trackingNumber || 'N/A'}</span></div>
            <div class="detail"><span class="label">Receiver Name:</span> <span class="value">${parcel.receiverName || 'N/A'}</span></div>
            <div class="detail"><span class="label">Receiver Mobile:</span> <span class="value">${parcel.receiverMobile || 'N/A'}</span></div>
            <div class="detail"><span class="label">Weight:</span> <span class="value">${parcel.weight || 'N/A'}</span></div>
            <div class="detail"><span class="label">Delivery Type:</span> <span class="value">${parcel.deliveryType || 'N/A'}</span></div>
            <div class="detail"><span class="label">Packing Type:</span> <span class="value">${parcel.packingType || 'N/A'}</span></div>
          </div>

          <h3>Sender Information</h3>
          <div class="section">
            <div class="detail"><span class="label">Name:</span> <span class="value">${sender.fullName || 'N/A'}</span></div>
            <div class="detail"><span class="label">Email:</span> <span class="value">${sender.email || 'N/A'}</span></div>
            <div class="detail"><span class="label">Mobile:</span> <span class="value">${sender.mobile || 'N/A'}</span></div>
            <div class="detail"><span class="label">Address:</span> <span class="value">${sender.address || 'N/A'}</span></div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open in new tab
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      this.alertService.showWarning('Unable to open print window. Please allow popups for this site or copy the invoice details manually.', 'Warning');
      return;
    }

    // Clean up the blob URL after printing
    printWindow.onload = function() {
      URL.revokeObjectURL(url);
    };
  }
}