import { ChangeDetectionStrategy, Component } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { MainCurrentUserFacade } from '../../../features/main/facades/main-current-user.facade';

@Component({
    selector: 'app-issues-cancel-modal',
    templateUrl: './issues-cancel-modal.component.html',
    styleUrls: ['./issues-cancel-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesCancelModalComponent {
  formData: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'standard',
      editMode: true,
      viewMode: 'edit',
    },
    template: [
      {
        type: 'textarea',
        formControlName: 'comment',
        label: 'Комментарий',
        edited: true,
        validations: ['required'],
      },
    ],
    FullName: 'Отмена заявки',
  };

  submit$ = new Subject<void>();

  constructor(
    public currentUserFacade: MainCurrentUserFacade,
    public dialogRef: DynamicDialogRef
  ) {}

  handleSubmit(formData: { comment: string }): void {
    this.onClose(formData);
  }

  onClose(data?: unknown): void {
    this.dialogRef.close(data);
  }
}
