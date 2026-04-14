import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markAsTouched } from '../../../../utilits/mark-as-touched.util';
import { OptionListSurveyInterface } from '@app/features/surveys-management/models/surveys-management.interface';
import { DocSignService } from '../../services/doc-sign.service';

@Component({
  selector: 'app-refuse-dialog',
  templateUrl: './refuse-dialog.component.html',
  styleUrls: ['./refuse-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RefuseDialogComponent implements OnInit {
  private docSignService = inject(DocSignService);

  controlName = 'comment';

  group = new FormGroup({
    [this.controlName]: new FormControl('', [Validators.required]),
  });

  refuseReasonList: OptionListSurveyInterface | null = null;
  useDropdown = false;
  loading = false;

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const refuseReasonListAlias = this.config.data?.refuseReasonList;
    if (refuseReasonListAlias && typeof refuseReasonListAlias === 'string') {
      this.loading = true;
      this.docSignService.getOptions(refuseReasonListAlias).subscribe({
        next: (data) => {
          if (data?.optionList && data.optionList.length > 0) {
            this.refuseReasonList = data;
            this.useDropdown = true;
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Ошибка при загрузке списка причин отказа:', error);
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  refuse(): void {
    markAsTouched(this.group);

    if (this.group.valid) {
      this.dialogRef.close({
        cancel: true,
        comment: this.group.get(this.controlName).value,
      });
    }
  }
}
