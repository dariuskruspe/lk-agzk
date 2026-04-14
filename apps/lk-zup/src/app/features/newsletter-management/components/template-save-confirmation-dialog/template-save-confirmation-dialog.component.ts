import { Component, inject, OnInit } from '@angular/core';
import { LangModule } from '@app/shared/features/lang/lang.module';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-template-save-confirmation-dialog',
  templateUrl: './template-save-confirmation-dialog.component.html',
  styleUrls: ['./template-save-confirmation-dialog.component.scss'],
  imports: [ButtonModule, LangModule],
  standalone: true,
})
export class TemplateSaveConfirmationDialogComponent implements OnInit {
  private dialogRef = inject(DynamicDialogRef);

  message = '';
  confirmButtonText = '';

  constructor(private config: DynamicDialogConfig, private translatePipe: TranslatePipe) {}

  ngOnInit(): void {
    this.message =
      this.config.data.message ||
      this.translatePipe.transform('NEWSLETTER_TEMPLATE_USED_IN_ACTIVE');
    this.confirmButtonText =
      this.config.data.confirmButtonText || this.translatePipe.transform('NEWSLETTER_YES_CHANGE');
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
