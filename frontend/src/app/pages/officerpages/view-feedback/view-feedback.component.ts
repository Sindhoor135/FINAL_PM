import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FeedbackService } from "../../../services/feedback.service";
import { AlertService } from "../../../services/alert.service";
import { Feedback } from "../../../models/feedback.model";

@Component({
  selector: 'app-view-feedback',
  imports: [CommonModule],
  templateUrl: './view-feedback.component.html',
  styleUrl: './view-feedback.component.css'
})
export class ViewFeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(private feedbackService: FeedbackService, private alertService: AlertService) {}

  ngOnInit() {
    this.getFeedbacks();
  }

  /**
   * Fetch all feedbacks from the service
   */
  getFeedbacks() {
    this.feedbackService.getAllFeedback()
      .subscribe({
        next: (response: any) => {
          this.feedbacks = response;
          console.log(this.feedbacks);
        },
        error: (error) => {
          console.error('Error fetching feedbacks:', error);
          this.alertService.showError('Failed to fetch feedbacks. Please try again.', 'Error');
        }
      });
  }
}
