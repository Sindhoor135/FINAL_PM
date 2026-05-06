import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  public alert$: Observable<AlertMessage | null> = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string): void {
    this.alertSubject.next({ message, type, title });
  }

  showSuccess(message: string, title?: string): void {
    this.showAlert(message, 'success', title);
  }

  showError(message: string, title?: string): void {
    this.showAlert(message, 'error', title);
  }

  showWarning(message: string, title?: string): void {
    this.showAlert(message, 'warning', title);
  }

  showInfo(message: string, title?: string): void {
    this.showAlert(message, 'info', title);
  }

  closeAlert(): void {
    this.alertSubject.next(null);
  }
}
