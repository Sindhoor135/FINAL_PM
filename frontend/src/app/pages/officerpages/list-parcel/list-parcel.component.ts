import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { ParcelService } from "../../../services/parcel.service";
import { AlertService } from "../../../services/alert.service";
import { Parcel } from "../../../models/parcel.model";

@Component({
  selector: "app-list-parcel",
  templateUrl: "./list-parcel.component.html",
  styleUrls: ["./list-parcel.component.css"],
  imports: [CommonModule, FormsModule],
})
export class OListParcelComponent implements OnInit {
  parcels: Parcel[] = [];
  searchTerm: string = '';
  selectedParcel: Parcel | null = null;
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  showTimingModal: boolean = false;
  showEditModal: boolean = false;

  statusOptions: string[] = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
  selectedStatus: string = '';
  pickupTime: string = '';
  dropTime: string = '';

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
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.getParcels();
  }

  /**
   * Fetch all parcels from the service
   */
  getParcels() {
    this.parcelService.getAllParcels()
      .subscribe({
        next: (response: any) => {
          this.parcels = response;
          console.log(this.parcels);
        },
        error: (error) => {
          console.error('Error fetching parcels:', error);
          this.alertService.showError('Failed to fetch parcels. Please try again.', 'Error');
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
   * Open update parcel status modal
   */
  updateParcel(parcel: Parcel) {
    this.selectedParcel = parcel;
    this.selectedStatus = '';
    this.showUpdateModal = true;
  }

  /**
   * Open update parcel timing modal
   */
  updateTiming(parcel: Parcel) {
    this.selectedParcel = parcel;
    this.pickupTime = '';
    this.dropTime = '';
    this.showTimingModal = true;
  }

  /**
   * Submit status update for a parcel
   */
  submitStatusUpdate() {
    if (!this.selectedStatus) {
      this.alertService.showWarning('Please select a status to update', 'Warning');
      return;
    }

    const trackingId = this.selectedParcel!.trackingNumber;

    this.parcelService.updateParcelStatus(trackingId, this.selectedStatus)
      .subscribe({
        next: (response) => {
          this.alertService.showSuccess('Status updated successfully!', 'Success');
          this.closeModal();
          this.getParcels();
        },
        error: (error) => {
          this.alertService.showError('Failed to update status. Please try again.', 'Error');
          console.error('Error updating status:', error);
        }
      });
  }

  /**
   * Submit timing update for a parcel
   */
  submitTimingUpdate() {
    if (!this.pickupTime || !this.dropTime) {
      this.alertService.showWarning('Please provide both pickup and drop times', 'Warning');
      return;
    }

    const trackingId = this.selectedParcel!.trackingNumber;
    const updateData = {
      pickupTime: this.pickupTime,
      dropTime: this.dropTime
    };

    this.parcelService.updateParcelTimings(trackingId, updateData)
      .subscribe({
        next: (response) => {
          this.alertService.showSuccess('Timings updated successfully!', 'Success');
          this.closeModal();
          this.getParcels();
        },
        error: (error) => {
          this.alertService.showError('Failed to update timings. Please try again.', 'Error');
          console.error('Error updating timings:', error);
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


  /**
   * Close all modals and reset state
   */
  closeModal() {
    this.showModal = false;
    this.showUpdateModal = false;
    this.showTimingModal = false;
    this.showEditModal = false;
    this.selectedParcel = null;
    this.selectedStatus = '';
    this.pickupTime = '';
    this.dropTime = '';
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
}
