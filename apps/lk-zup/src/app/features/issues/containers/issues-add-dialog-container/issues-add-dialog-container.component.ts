import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AbstractFacade } from '../../../../shared/classes/abstractions/abstract.facade';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { CustomDialogService } from '../../../../shared/services/dialog.service';
import { EmployeesAdditionalStaticDataFacade } from '../../../employees/facades/employees-additional-static-data.facade';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { IssuesApprovingPersonsFacade } from '../../facades/issues-approving-persons.facade';
import { IssuesTypeFacade } from '../../facades/issues-type.facade';
import { IssuesFacade } from '../../facades/issues.facade';
import { IssuesTypesTemplateInterface } from '../../models/issues-types.interface';
import { IssuesAbstractAddContainerComponent } from '../issues-abstract-add-container/issues-abstract-add-container.component';

@Component({
    selector: 'app-issues-add-dialog-container',
    templateUrl: './issues-add-dialog-container.component.html',
    styleUrls: ['./issues-add-dialog-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class IssuesAddDialogContainerComponent
  extends IssuesAbstractAddContainerComponent
  implements OnInit
{
  submit$ = new Subject<void>();

  public data: {
    alias?: string;
    id?: string;
    formData: unknown;
    facade?: AbstractFacade<IssuesTypesTemplateInterface>;
    onOtherEmployee?: boolean;
  };

  public type$: Observable<IssuesTypesTemplateInterface>;

  public onOtherEmployee = false;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public issuesTypeFacade: IssuesTypeFacade,
    public issuesFacade: IssuesFacade,
    public langFacade: LangFacade,
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade,
    public employeesAdditionalStaticDataFacade: EmployeesAdditionalStaticDataFacade,
    protected issuesApprovingPersonsFacade: IssuesApprovingPersonsFacade,
  ) {
    super(
      issuesFacade,
      issuesTypeFacade,
      issuesApprovingPersonsFacade,
      employeesAdditionalStaticDataFacade,
    );
    this.data = this.config.data;
    if (this.data.facade) {
      this.type$ = this.data.facade?.forcedData$;
    }
    this.id = this.data.id;
    this.alias = this.data.alias;

    this.onOtherEmployee = this.data?.onOtherEmployee;

    this.issuesFacade.setDialogToClose(this.dialogRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.issuesTypeFacade
      .getData$()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((v) => {
        if (!this.config.header) {
          this.config.header = v.FullName;
        }
      });
    this.data?.facade
      ?.getData$()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((v) => {
        if (!this.config.header) {
          this.config.header = v.FullName;
        }
      });
  }

  onSubmitDialog(): void {
    this.submit$.next();
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  addDialogIssue(issue: any): void {
    if (
      this.data?.facade?.getData()?.alias === 'changeClinic' ||
      this.data?.facade?.getData()?.alias === 'deleteInsurance'
    ) {
      this.addIssue(issue, this.data.facade.getData());
    } else {
      this.addIssue(issue);
    }
  }
}
