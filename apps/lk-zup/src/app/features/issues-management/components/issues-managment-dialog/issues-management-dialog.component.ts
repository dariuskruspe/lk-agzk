import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacationsStateInterface } from '../../../vacations/models/vacations-states.interface';
import { IssuesApprovingListFacade } from '../../facades/issues-approving-list.facade';
import { IssuesManagementListInterfaces } from '../../models/issues-management-list.interfaces';

@Component({
    selector: 'app-issues-management-dialog',
    templateUrl: './issues-management-dialog.component.html',
    styleUrls: ['./issues-management-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesManagementDialogComponent implements OnInit {
  toastService: MessageSnackbarService = inject(MessageSnackbarService);

  translatePipe: TranslatePipe = inject(TranslatePipe);

  result = false;

  comment;

  items = [];

  tasks: IssuesManagementListInterfaces[] = [];

  states: VacationsStateInterface[] = [];

  success: boolean;

  reject: boolean;

  loading = false;

  countOfErrors = 0;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public issuesApprovingListFacade: IssuesApprovingListFacade
  ) {}

  ngOnInit(): void {
    this.success = this.config.data.success;
    if (!this.success) {
      this.result = this.config.data.result;
      this.tasks = this.config.data.issues;
      this.reject = this.config.data.reject;
      if (this.result) {
        this.items = this.config.data.results;
        this.states = this.config.data.statusList;
        this.countOfErrors = this.items.filter(
          (item) => item.success === false
        ).length;
      }
    } else {
      this.reject = this.config.data.reject;
    }
  }

  getTaskById(id: string): IssuesManagementListInterfaces {
    return this.tasks.find((task) => task.taskID === id);
  }

  approve(approve: boolean): void {
    this.loading = true;
    const tasksList = this.tasks.map((task) => {
      return { taskId: task.taskID, approve };
    });
    this.issuesApprovingListFacade.show({
      tasks: tasksList,
      comment: this.comment,
    });
    this.issuesApprovingListFacade.getData$().subscribe((data) => {
      const errors = data.filter((res) => res.success === false);

      this.showApprovalResultToast(
        approve ? 'approve' : 'decline',
        !!errors.length
      );

      this.loading = false;
      this.dialogRef.close({ error: !!errors.length, results: data, approve });
    });
  }

  showApprovalResultToast(
    action: 'approve' | 'decline',
    hasErrors: boolean
  ): void {
    setTimeout((_) => {
      this.toastService.show(
        this.translatePipe.transform(
          action === 'approve'
            ? hasErrors
              ? 'APPLICATIONS_APPROVE_ERROR'
              : 'APPLICATIONS_APPROVE_SUCCESS'
            : hasErrors
            ? 'APPLICATIONS_DECLINE_ERROR'
            : 'APPLICATIONS_DECLINE_SUCCESS'
        ),
        hasErrors ? MessageType.error : MessageType.success
      );
    }, this.toastService.debounceTimeMs);
  }

  close(): void {
    this.dialogRef.close();
  }
}
