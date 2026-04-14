import { Component, OnDestroy, OnInit } from '@angular/core';
import { IssuesTypesTemplateInterface } from '@features/issues/models/issues-types.interface';
import { Subject } from 'rxjs';
import { EmployeesAdditionalStaticDataFacade } from '../../../employees/facades/employees-additional-static-data.facade';
import { IssuesApprovingPersonsFacade } from '../../facades/issues-approving-persons.facade';
import { IssuesTypeFacade } from '../../facades/issues-type.facade';
import { IssuesFacade } from '../../facades/issues.facade';
import { IssuesInterface } from '../../models/issues.interface';

@Component({
    template: '',
    standalone: false
})
export class IssuesAbstractAddContainerComponent implements OnInit, OnDestroy {
  public alias: string;

  protected id: string;

  protected destroy$ = new Subject<void>();

  constructor(
    protected issuesFacade: IssuesFacade,
    protected issuesTypeFacade: IssuesTypeFacade,
    protected issuesApprovingPersonsFacade: IssuesApprovingPersonsFacade,
    protected employeesAdditionalStaticDataFacade: EmployeesAdditionalStaticDataFacade
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.issuesTypeFacade.showIssueType(this.id);
      this.issuesApprovingPersonsFacade.showApprovingPersons(this.id);
    } else if (this.alias) {
      this.issuesTypeFacade.showIssueTypeAlias(this.alias);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addIssue(
    issue: IssuesInterface,
    issueChangeClinicType?: IssuesTypesTemplateInterface
  ): void {
    const issueType = issueChangeClinicType
      ? issueChangeClinicType
      : this.issuesTypeFacade.getData();
    const modValue = {
      ...issue,
      issueTypeID: this.id ? this.id : issueType.issueTypeID,
    };
    this.issuesFacade.addIssue(modValue);
    this.employeesAdditionalStaticDataFacade.getUpdatingStaticData(
      issueType.options.staticInfo
    );
  }
}
