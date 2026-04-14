import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceCalculatorComponent } from '@features/insurance/components/insurance-calculator/insurance-calculator.component';
import { IssuesService } from '@features/issues/services/issues.service';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { IssuesAddInterface } from '../../models/issues-add.interface';
import { IssuesTypesTemplateInterface } from '../../models/issues-types.interface';
import { IssuesEmployeeNameUtils } from '../../utils/issues-employee-name.utils';
import { logDebug } from '@shared/utilits/logger';
import { IBalanceByType } from '@features/issues/models/issues.interface';
import { IssuesVacationBalanceFacade } from '@features/issues/facades/issues-vacation-balance.facade';

@Component({
    selector: 'app-issues-add',
    templateUrl: './issues-add.component.html',
    styleUrls: ['./issues-add.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddComponent implements OnChanges, OnInit {
  issuesService: IssuesService = inject(IssuesService);

  submit$ = new Subject<void>();

  isOrder: boolean;

  formData;

  employeeDataModded: {
    value: string;
    title: string;
  }[] = [];

  currentDay = new Date();

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() loading: boolean;

  @Input() dateLocale: string;

  @Input() employeesStaticData: IssuesAddInterface;

  @Input() employeesAdditionalStaticData: Partial<IssuesAddInterface>;

  @Input() employeesApprovingPersons: string[];

  @Input() signatureValidation: boolean;

  @Input() currentUserSingState: boolean;

  @Input() vacationBalance: {
    vacations: IBalanceByType[];
    vacationsTotal: number;
  };

  @Output() getEmployeeData = new EventEmitter();

  @Output() issueFormSubmit = new EventEmitter();

  @Output() createIssue = new EventEmitter();

  @Output() backPage = new EventEmitter<void>();

  activeIndex = 0;

  templates: { title: string; value: 'onOtherEmployees' | 'onApplicant' }[] = [
    {
      title: 'LEAVE_ISSUE_ON_OTHER_EMPLOYEE',
      value: 'onOtherEmployees',
    },
  ];

  constructor(
    private issuesEmployeeNameUtils: IssuesEmployeeNameUtils,
    public currentUser: MainCurrentUserFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translatePipe: TranslatePipe,
    private dialogService: DialogService,
    public issuesVacationBalanceFacade: IssuesVacationBalanceFacade,
  ) {}

  ngOnInit(): void {
    if (!this.issuesType?.onApplicant && this.issuesType?.onOtherEmployees) {
      this.issuesType.template = this.issuesType.templateOnOtherEmployees;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.issuesType?.currentValue) {
      this.getEmployeeData.emit();
      this.formData = { ...this.issuesType };
      this.isOrder =
        this.activatedRoute?.snapshot?.queryParams?.isOrder === 'true';
      if (this.issuesType.template) {
        this.templates.unshift({
          title: 'LEAVE_ISSUE_ON_APPLICANT',
          value: 'onApplicant',
        });
      } else {
        this.issueTypeEmplChange('onOtherEmployees');
      }
      if (this.isOrder && this.templates.length > 1) {
        // 1 is the index of the manager tab
        this.chooseTab(1);
      }
      if (this.issuesType.options.showVacationBalance) {
        this.issuesVacationBalanceFacade.vacationBalance();
      }
    }
    if (
      (!changes?.loading && this.employeesStaticData && this.issuesType) ||
      (!changes?.loading && this.issuesType && this.employeesStaticData)
    ) {
      this.employeeDataModded = [];
      if (this.employeesAdditionalStaticData) {
        this.employeesStaticData = {
          ...this.employeesStaticData,
          ...this.employeesAdditionalStaticData,
        };
      }
      for (const name of this.issuesType?.options?.staticInfo || []) {
        if (
          this.employeesStaticData[name] &&
          this.employeesStaticData[name].value
        ) {
          this.employeeDataModded.push({
            value: this.issuesEmployeeNameUtils.getValue(
              name,
              this.employeesStaticData[name].value,
            ),
            title: this.employeesStaticData[name].name,
          });
        }
      }
    }
  }

  issueTypeEmplChange(name: string): void {
    this.isOrder = name === 'onOtherEmployees';
    this.router
      .navigate([], {
        queryParams: {
          isOrder: this.isOrder,
        },
      })
      .then(() => {});
    this.onToggleTemplate();
  }

  onCreateIssue(form: FormGroup): void {
    const vacationDocument =
      this.activatedRoute?.snapshot?.queryParams?.vacationDocument;
    let orderedValue;
    if (vacationDocument) {
      orderedValue = { ...form, isOrder: this.isOrder, vacationDocument };
    } else {
      orderedValue = { ...form, isOrder: this.isOrder };
    }
    this.createIssue.emit(orderedValue);
  }

  submitForm(): void {
    this.submit$.next();
  }

  onSubmitFormFailed($event: { form: FormGroup }): void {
    // const { form } = $event;
    logDebug('[issues-add.component.ts] onSubmitFormFailed -> $event', $event);
  }

  onBackPage(): void {
    this.backPage.emit();
  }

  onToggleTemplate(): void {
    this.formData = { ...this.issuesType };
    this.formData.template = this.isOrder
      ? this.issuesType.templateOnOtherEmployees
      : this.issuesType.template;
  }

  chooseTab(index: number): void {
    this.activeIndex = index;
    this.issueTypeEmplChange(this.templates[index].value);
  }

  openCalculator(): void {
    this.dialogService.open(InsuranceCalculatorComponent, {
      width: '700px',
      header: this.translatePipe.transform('INSURANCE_CALCULATOR_LABEL'),
      closable: true,
    });
  }
}
