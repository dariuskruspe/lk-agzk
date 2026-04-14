import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CustomDialogService } from '../../../../shared/services/dialog.service';

@Component({
    selector: 'app-issues-approve-dialog-container',
    templateUrl: './issues-approve-dialog-container.component.html',
    styleUrls: ['./issues-approve-dialog-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class IssuesApproveDialogContainerComponent {
  comment: string;

  public isApproved: boolean;

  public required: boolean;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.isApproved = this.config.data.isApproved;
    this.required = this.config.data.required;
  }

  onSubmitDialog(): void {
    this.dialogRef.close({ result: true, comment: this.comment });
  }

  onCloseDialog(): void {
    this.dialogRef.close({ result: false, comment: this.comment });
  }
}
