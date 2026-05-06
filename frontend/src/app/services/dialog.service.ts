import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogPayload {
  visible: boolean;
  type: 'confirm';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  resolve: (value: boolean) => void;
}

export interface PromptDialogPayload {
  visible: boolean;
  type: 'prompt';
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText: string;
  cancelText: string;
  resolve: (value: string | null) => void;
}

export type DialogPayload = ConfirmDialogPayload | PromptDialogPayload;

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<DialogPayload | null>(null);
  public dialog$: Observable<DialogPayload | null> = this.dialogSubject.asObservable();

  confirm(message: string, title = 'Confirm', confirmText = 'Yes', cancelText = 'No'): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogSubject.next({
        visible: true,
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        resolve
      });
    });
  }

  prompt(message: string, title = 'Input Required', placeholder = '', defaultValue = '', confirmText = 'Submit', cancelText = 'Cancel'): Promise<string | null> {
    return new Promise((resolve) => {
      this.dialogSubject.next({
        visible: true,
        type: 'prompt',
        title,
        message,
        placeholder,
        defaultValue,
        confirmText,
        cancelText,
        resolve
      });
    });
  }

  closeDialog(result: boolean | string | null): void {
    const current = this.dialogSubject.value;
    if (!current) {
      return;
    }

    if (current.type === 'confirm') {
      current.resolve(typeof result === 'boolean' ? result : false);
    } else {
      current.resolve(typeof result === 'string' || result === null ? result : null);
    }

    this.dialogSubject.next(null);
  }
}
