import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogPayload, PromptDialogPayload, DialogService } from '../../services/dialog.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DialogModalComponent implements OnInit, OnDestroy {
  dialog: DialogPayload | null = null;
  inputValue: string = '';
  
  get isPrompt(): boolean {
    return this.dialog?.type === 'prompt';
  }

  get promptPlaceholder(): string {
    if (this.dialog?.type === 'prompt') {
      return (this.dialog as PromptDialogPayload).placeholder ?? '';
    }
    return '';
  }

  private destroy$ = new Subject<void>();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.dialogService.dialog$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dialog) => {
        this.dialog = dialog;
        if (dialog?.type === 'prompt') {
          const promptDialog = dialog as PromptDialogPayload;
          this.inputValue = promptDialog.defaultValue ?? '';
        } else {
          this.inputValue = '';
          
        }
      });
  }

  confirm(): void {
    if (!this.dialog) {
      return;
    }
    if (this.dialog.type === 'prompt') {
      this.dialogService.closeDialog(this.inputValue);
    } else {
      this.dialogService.closeDialog(true);
    }
  }

  cancel(): void {
    this.dialogService.closeDialog(this.dialog?.type === 'prompt' ? null : false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
