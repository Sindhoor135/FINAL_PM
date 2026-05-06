import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertMessage } from '../../services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class AlertModalComponent implements OnInit, OnDestroy {
  currentAlert: AlertMessage | null = null;
  private destroy$ = new Subject<void>();
  private closeTimer: any;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$
      .pipe(takeUntil(this.destroy$))
      .subscribe((alert) => {
        this.currentAlert = alert;
        if (alert) {
          this.clearCloseTimer();
          // Auto-close after 4 seconds
          this.closeTimer = setTimeout(() => {
            this.closeAlert();
          }, 4000);
        }
      });
  }

  closeAlert(): void {
    this.clearCloseTimer();
    this.alertService.closeAlert();
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
