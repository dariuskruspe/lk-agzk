import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, Button],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  standalone: true,
})
export class ConfirmationDialogComponent implements OnInit {
  config = inject<DynamicDialogConfig<ConfirmationDialogDataInterface>>(
    DynamicDialogConfig,
  );

  ref = inject(DynamicDialogRef);

  message = '';
  confirmButtonText = 'Сохранить';
  cancelButtonText = 'Отменить';

  ngOnInit(): void {
    this.message = this.config.data?.message || 'Вы уверены?';
    this.confirmButtonText = this.config.data?.confirmButtonText || 'Сохранить';
    this.cancelButtonText = this.config.data?.cancelButtonText || 'Отменить';
  }

  onConfirm(): void {
    this.ref.close(true);
  }

  onCancel(): void {
    this.ref.close(false);
  }
}

export interface ConfirmationDialogDataInterface {
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

