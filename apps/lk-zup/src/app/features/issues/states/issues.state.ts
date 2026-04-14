import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslatePipe } from '../../../shared/features/lang/pipes/lang.pipe';
import { EmployeesStaticDataManagerFacade } from '../../employees/facades/employees-static-data-manager.facade';
import { IssuesCrossingDialogComponent } from '../components/issues-crossing-dialog/issues-crossing-dialog.component';
import { IssuesTypesTemplateInterface } from '../models/issues-types.interface';
import { IssuesInterface } from '../models/issues.interface';
import { IssuesTypeService } from '../services/issues-type.service';
import { IssuesService } from '../services/issues.service';
import { IssuesStatusStepsFacade } from '@features/issues/facades/issues-status-steps.facade';

@Injectable({
  providedIn: 'root',
})
export class IssuesState {
  public entityName = 'issueAdd';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.showIssue,
      success: this.showIssueSuccess,
    },
    add: {
      main: this.addIssue,
      success: this.addSuccess,
    },
    edit: {
      main: this.editIssue,
      success: this.editIssueSuccess,
    },
  };

  dialog: DynamicDialogRef | null = null;

  issueBodyCopy: IssuesInterface | null = null;

  constructor(
    private issuesTypeService: IssuesTypeService,
    private issuesService: IssuesService,
    private router: Router,
    private employeesStaticDataManagerFacade: EmployeesStaticDataManagerFacade,
    public dialogService: DialogService,
    private translatePipe: TranslatePipe,
    public issuesStatusStepsFacade: IssuesStatusStepsFacade,
    private geRx: GeRx
  ) {}

  showIssue(id: string): Observable<{
    issue: IssuesInterface;
    issueType: IssuesTypesTemplateInterface;
  }> {
    return this.issuesService.showIssue(id).pipe(
      switchMap((issue) => {
        const issueType = this.issuesTypeService.getIssuesType(
          issue.IssueTypeID
        );
        return forkJoin({ issue: of(issue), issueType });
      })
    );
  }

  addIssue(body: IssuesInterface): Observable<IssuesInterface> {
    this.issueBodyCopy = body;
    return this.issuesService.addIssue(body);
  }

  showIssueSuccess(data: {
    issue: IssuesInterface;
    issueType: IssuesTypesTemplateInterface;
  }): Observable<void> {
    if (
      data.issue?.formData &&
      data.issueType?.options.staticInfo &&
      !data.issue?.isOrder
    ) {
      this.employeesStaticDataManagerFacade.getStaticData(
        data.issue.formData.employeeID.toString(),
        data.issueType.options.staticInfo
      );
    }
    this.issuesStatusStepsFacade.getList(data.issue.IssueID);
    this.issuesStatusStepsFacade.setStateOrder(data.issue.stateOrder);
    return of();
  }

  addSuccess(response: IssuesInterface): Observable<unknown> {
    if (!response.success && response.periodCrossingData.length) {
      this.addErrorCrossing(response);
      return of();
    } else {
      this.issueBodyCopy = null;
      if (this.dialog) {
        this.dialog.close('success');
      }
      this.dialog = null;
      if (response.signatureEnable) {
        this.router
          .navigate(['issues', 'list', response.IssueID], {
            queryParams: { draft: true },
          })
          .then(() => {});
        return of();
      }
      if (this.router.url.includes('issues/types')) {
        return of(this.router.navigate(['']));
      } else {
        if (
          !this.router.url.includes('business-trip') &&
          !this.router.url.includes('my-insurance')
        ) {
          window.location.reload();
          return of();
        }
        return of();
      }
    }
  }

  addErrorCrossing(response: IssuesInterface) {
    const dialogRef = this.dialogService.open(IssuesCrossingDialogComponent, {
      width: '1065px',
      data: {
        block: response.block,
        periodCrossingData: response.periodCrossingData,
      },
      header: this.translatePipe.transform('ISSUE_CROSSING_PERIODS'),
      closable: true,
      dismissableMask: true,
    });

    // закомментил в PJLKS-2111 (логика перенесена в issues-crossing-dialog.component.ts -> anywayCreateIssue)
    // dialogRef.onClose.pipe(take(1)).subscribe((result) => {
    //   if (result) {
    //     this.issuesService.loading.set(true);
    //     this.issuesService
    //       .addIssue({
    //         ...this.issueBodyCopy,
    //         createWithoutPeriodsCheck: true,
    //       })
    //       .subscribe((secondResponse) => {
    //         this.addSuccess(secondResponse);
    //       });
    //   }
    // });
  }

  editIssue(body: IssuesInterface): Observable<IssuesInterface> {
    return this.issuesService.editIssue(body);
  }

  editIssueSuccess(issue: IssuesInterface): Observable<void> {
    // todo need refactoring this.showIssue (separate mergeMap)
    return of(this.geRx.show(this.entityName, issue.IssueID));
  }
}
