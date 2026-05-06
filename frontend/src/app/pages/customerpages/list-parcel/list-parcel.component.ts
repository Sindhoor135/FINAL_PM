import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { ParcelService } from "../../../services/parcel.service";
import { FeedbackService } from "../../../services/feedback.service";
import { AlertService } from "../../../services/alert.service";
import { DialogService } from "../../../services/dialog.service";
import { Parcel, ParcelStatusUpdateResponse } from "../../../models/parcel.model";
import { FeedbackRequest } from "../../../models/feedback.model";

@Component({
  selector: "app-list-parcel",
  templateUrl: "./list-parcel.component.html",
  styleUrls: ["./list-parcel.component.css"],
  imports: [CommonModule, FormsModule],
})
export class ListParcelComponent implements OnInit {
  parcels: Parcel[] = [];
  searchTerm: string = '';
  selectedParcel: Parcel | null = null;
  showModal: boolean = false;
  userId: number = 0;
  showFeedbackModal: boolean = false;
  feedbackParcel: Parcel | null = null;
  feedbackRating: number = 0;
  feedbackComment: string = '';
  showEditModal: boolean = false;

  // Edit modal state
  editFormData: any = {
    senderName: '',
    senderMobile: '',
    senderAddress: '',
    receiverName: '',
    receiverMobile: '',
    deliveryAddress: '',
    pickupDate: ''
  };
  minDate: string = '';

  constructor(
    private authService: AuthService,
    private parcelService: ParcelService,
    private feedbackService: FeedbackService,
    private alertService: AlertService,
    private dialogService: DialogService
  ) {
    const authResponse = localStorage.getItem('authResponse');
    if (authResponse) {
      const parsed = JSON.parse(authResponse);
      this.userId = parsed.userId ?? 0;
    }
  }

  ngOnInit() {
    this.getParcels();
  }

  /**
   * Fetch customer parcels from the service
   */
  getParcels() {
    this.parcelService.getCustomerParcels(this.userId)
      .subscribe({
        next: (response: any) => {
          this.parcels = response;
          console.log(this.parcels);
        },
        error: (error) => {
          console.error('Error fetching parcels:', error);
        }
      });
  }

  /**
   * Get filtered parcels based on search term
   */
  get filteredParcels(): Parcel[] {
    if (!this.searchTerm.trim()) {
      return this.parcels;
    }
    const searchLower = this.searchTerm.toLowerCase();
    return this.parcels.filter((parcel) =>
      (parcel.id && parcel.id.toString().toLowerCase().includes(searchLower)) ||
      parcel.trackingNumber.toLowerCase().includes(searchLower) ||
      parcel['senderName'].toLowerCase().includes(searchLower) ||
      parcel.receiverName.toLowerCase().includes(searchLower) ||
      (parcel.status && parcel.status.toLowerCase().includes(searchLower))
    );
  }

  /**
   * View parcel details
   */
  viewDetails(parcel: Parcel) {
    this.selectedParcel = parcel;
    this.showModal = true;
    console.log('Parcel details:', parcel);
  }

  /**
   * Close details modal
   */
  closeModal() {
    this.showModal = false;
    this.showEditModal = false;
    this.selectedParcel = null;
    this.editFormData = {
      senderName: '',
      senderMobile: '',
      senderAddress: '',
      receiverName: '',
      receiverMobile: '',
      deliveryAddress: '',
      pickupDate: ''
    };
  }

  /**
   * Open feedback modal
   */
  openFeedbackModal(parcel: Parcel) {
    this.feedbackParcel = parcel;
    this.showFeedbackModal = true;
    this.feedbackRating = 0;
    this.feedbackComment = '';
  }

  /**
   * Close feedback modal
   */
  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackParcel = null;
  }

  /**
   * Cancel a parcel
   */
  cancelParcel(parcel: Parcel) {
    this.dialogService.confirm(
      'Are you sure you want to cancel this parcel? This action cannot be undone.',
      'Confirm Cancel',
      'Yes, Cancel',
      'No'
    ).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.parcelService.cancelParcel(parcel.trackingNumber)
        .subscribe({
          next: (response) => {
            console.log('Parcel cancelled:', response);
            this.alertService.showSuccess('Parcel cancelled successfully!', 'Success');
            this.getParcels(); // Refresh the list
          },
          error: (error) => {
            console.error('Error cancelling parcel:', error);
            this.alertService.showError('Failed to cancel parcel. Please try again.', 'Error');
          }
        });
    });
  }

  /**
   * Submit feedback for a parcel
   */
  submitFeedback() {
    if (!this.feedbackParcel || this.feedbackRating === 0) return;

    const feedbackData: FeedbackRequest = {
      rating: this.feedbackRating,
      comment: this.feedbackComment
    };

    this.feedbackService.submitFeedback(
      this.userId,
      this.feedbackParcel.trackingNumber,
      feedbackData
    ).subscribe({
      next: (response) => {
        console.log('Feedback submitted:', response);
        this.closeFeedbackModal();
        this.alertService.showSuccess('Thank you for your feedback!', 'Success');
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.alertService.showError('Failed to submit feedback. Please try again.', 'Error');
      }
    });
  }

  /**
   * Open edit parcel modal
   */
  openEditModal(parcel: Parcel) {
    this.selectedParcel = parcel;
    this.editFormData = {
      senderName: parcel.sender?.fullName || '',
      senderMobile: parcel.sender?.mobile || '',
      senderAddress: parcel.sender?.address || '',
      receiverName: parcel.receiverName || '',
      receiverMobile: parcel.receiverMobile || '',
      deliveryAddress: parcel.deliveryAddress || '',
      pickupDate: parcel.pickupTime || ''
    };
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.showEditModal = true;
  }

  /**
   * Check if parcel status is BOOKED
   */
  isBookedStatus(): boolean {
    return this.selectedParcel?.status === 'BOOKED';
  }

  /**
   * Submit edit parcel
   */
  submitEditParcel() {
    if (!this.selectedParcel) {
      this.alertService.showWarning('No parcel selected', 'Warning');
      return;
    }

    // Validation
    if (this.isBookedStatus()) {
      if (!this.editFormData.pickupDate || !this.editFormData.deliveryAddress) {
        this.alertService.showWarning('Please fill in all required fields', 'Warning');
        return;
      }
    } else {
      if (!this.editFormData.senderName || !this.editFormData.senderMobile || 
          !this.editFormData.receiverName || !this.editFormData.receiverMobile) {
        this.alertService.showWarning('Please fill in all required fields', 'Warning');
        return;
      }
    }

    const trackingNumber = this.selectedParcel.trackingNumber;
    const updateData = { ...this.editFormData };

    this.parcelService.updateParcelDetails(trackingNumber, updateData)
      .subscribe({
        next: (response) => {
          this.alertService.showSuccess('Parcel details updated successfully!', 'Success');
          this.closeModal();
          this.getParcels();
        },
        error: (error) => {
          this.alertService.showError('Failed to update parcel details. Please try again.', 'Error');
          console.error('Error updating parcel details:', error);
        }
      });
  }

}
