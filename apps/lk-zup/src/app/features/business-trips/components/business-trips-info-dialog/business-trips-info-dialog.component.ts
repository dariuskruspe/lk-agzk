import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@shared/services/app.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';
import { IssuesCancelModalComponent } from '@shared/components/issues-cancel-modal/issues-cancel-modal.component';
import { DateClass } from '@shared/features/calendar-graph/classes/date.class';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { IssuesAddDialogContainerComponent } from '../../../issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { IssuesCancelFacade } from '../../../issues/facades/issues-cancel.facade';
import { BusinessTripsDocumentFieldsFacade } from '../../facades/business-trips-document-fields.facade';
import { BusinessTripsIssuesFieldsFacade } from '../../facades/business-trips-issues-fields.facade';

@Component({
    selector: 'app-business-trips-info-dialog',
    templateUrl: './business-trips-info-dialog.component.html',
    styleUrls: ['./business-trips-info-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BusinessTripsInfoDialogComponent {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  info: {
    dateStart: string;
    dateEnd: string;
    count: number;
    name: string;
    status:
      | 'availible'
      | 'onApproval'
      | 'cancelled'
      | 'availibleAndLinkedIssue';
    issueId: string;
    documentId: string;
    pointType: {
      id: string;
      plan: boolean;
      issueIdCancel: string;
      issueIdChange: string;
      issueIdCreate: string;
    };
    enableButtons: boolean;
    enableReportButtons: boolean;
    linkedIssueTypeId: string;
    linkedIssueId: string;
    cancelAccess: boolean;
  };

  constructor(
    public date: DateClass,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
    public businessTripsIssuesFieldsFacade: BusinessTripsIssuesFieldsFacade,
    public businessTripsDocumentFieldsFacade: BusinessTripsDocumentFieldsFacade,
    public issuesCancelFacade: IssuesCancelFacade,
    private router: Router
  ) {
    this.info = this.config.data;

    // меняем заголовок модалки в зависимости от статуса
    if (this.info.status === 'onApproval') {
      this.config.header =
        this.config.header +
        ' (' +
        this.translatePipe.transform('DOCUMENTS_AGREE') +
        ')';
    } else if (this.info.status === 'cancelled') {
      this.config.header = this.translatePipe.transform(
        'BUSINESS_TRIP_ISSUES_CANCELLING'
      );
    }
    if (this.info.issueId) {
      this.businessTripsIssuesFieldsFacade.getIssueFields(this.info.issueId);
    }
  }

  close(needReload?: boolean): void {
    this.ref.close(needReload || false);
  }

  changeIssue(): void {
    if (!this.info.pointType.plan && !this.info.issueId) {
      this.businessTripsDocumentFieldsFacade.getDocumentFields(
        this.info.pointType.issueIdChange,
        this.info.pointType.id,
        this.info.documentId
      );
      this.businessTripsDocumentFieldsFacade.getData$().subscribe((data) => {
        this.dialogService.open(IssuesAddDialogContainerComponent, {
          width: this.isMobileV() ? '100%' : '1065px',
          data: {
            id: this.info.pointType.issueIdChange,
            formData: { ...data.fields, documentId: this.info.documentId },
          },
          closable: true,
        });
        this.close(true);
      });
    } else {
      const dialogRef = this.dialogService.open(
        IssuesAddDialogContainerComponent,
        {
          width: this.isMobileV() ? '100%' : '1065px',
          data: {
            id: this.info.pointType.issueIdChange,
            formData: {
              ...this.businessTripsIssuesFieldsFacade.getData().formData,
              documentId: this.info.documentId,
              issueId: this.info.issueId,
            },
          },
          closable: true,
        }
      );

      dialogRef.onClose.pipe(take(1)).subscribe((data) => {
        // if (data === 'success') {
        //   this.issuesCancelFacade.issueCancel({
        //     issueID: this.info.issueId,
        //     comment: '',
        //     skipControl: true,
        //   });
        //   this.issuesCancelFacade.getData$().subscribe(() => {
        this.close(true);
        //   });
        // }
      });
    }
  }

  cancelIssue(): void {
    if (this.info.pointType.plan) {
      const dialogRef = this.dialogService.open(IssuesCancelModalComponent, {
        width: this.isMobileV() ? '100%' : '1065px',
        closable: true,
        showHeader: true,
        header: this.translatePipe.transform('ISSUES_CANCEL_MODAL_HEADER'),
      });

      dialogRef.onClose.subscribe((result) => {
        if (result) {
          this.issuesCancelFacade.issueCancel({
            issueID: this.info.issueId,
            comment: result.comment,
            skipControl: true,
          });
          this.issuesCancelFacade.getData$().subscribe(() => {
            this.close(true);
            window.location.reload();
          });
        }
      });
    } else {
      this.businessTripsDocumentFieldsFacade.getDocumentFields(
        this.info.pointType.issueIdCancel,
        this.info.pointType.id,
        this.info.documentId
      );
      this.businessTripsDocumentFieldsFacade
        .getData$()
        .pipe(take(1))
        .subscribe((data) => {
          const dialogCloseRef = this.dialogService.open(
            IssuesAddDialogContainerComponent,
            {
              width: this.isMobileV() ? '100%' : '1065px',
              data: {
                id: this.info.pointType.issueIdCancel,
                formData: {
                  ...data.fields,
                  documentId: this.info.documentId,
                  issueId: this.info.issueId,
                  dateBegin: this.info.dateStart,
                  dateEnd: this.info.dateEnd,
                },
              },
              closable: true,
            }
          );
          dialogCloseRef.onClose.subscribe(() => {
            this.close(true);
          });
        });
    }
  }

  toIssue(): void {
    this.router
      .navigate(['', 'issues', 'types', this.info.linkedIssueTypeId], {
        queryParams: { documentId: this.info.documentId },
      })
      .then();
    this.close();
  }

  toCreatedIssue() {
    this.router
      .navigate(['', 'issues', 'list', this.info.linkedIssueId])
      .then();
    this.close();
  }
}
