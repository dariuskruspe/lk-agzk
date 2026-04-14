import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ItemListInterface } from '../../../../../shared/components/item-list/models/item-list.interface';
import { MainCurrentUserInterface } from '../../../../main/models/main-current-user.interface';
import { IssuesAddInterface } from '../../../models/issues-add.interface';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IssuesEmployeeNameUtils } from '../../../utils/issues-employee-name.utils';

@Component({
    selector: 'app-issues-add-compensation',
    templateUrl: './issues-add-compensation.component.html',
    styleUrls: ['./issues-add-compensation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddCompensationComponent implements OnChanges {
  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() isLoading: boolean;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() employeesStaticData: IssuesAddInterface;

  @Input() employeesAdditionalStaticData: IssuesAddInterface;

  @Input() optionLists;

  @Input() issuesOptionLists;

  @Input() vacationBalanceByTypeID;

  @Input() employeesApprovingPersons: string[];

  @Output() issueFormSubmit = new EventEmitter();

  formData: FormGroup;

  staticData: ItemListInterface[] = [];

  invalidNumDays = false;

  vacationType = new FormControl(null, Validators.required);

  numOfDays = new FormControl('', [Validators.required]);

  employeeDataModded: {
    value: string;
    title: string;
  }[] = [];

  parentId: string;

  constructor(
    private fb: FormBuilder,
    private issuesEmployeeNameUtils: IssuesEmployeeNameUtils
  ) {}

  setCopingValue(): void {
    const data = localStorage.getItem('issue_data')
      ? JSON.parse(localStorage.getItem('issue_data'))
      : null;
    localStorage.removeItem('issue_data');
    if (data) {
      this.parentId = data.parentId;
      const type = this.vacationBalanceByTypeID.find(
        (vac) => vac.vacationID === data.vacationType
      );
      this.vacationType.setValue(type);
      this.numOfDays.setValue(data.AmountOfDays);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeeStaticData?.currentValue) {
      if (this.employeesAdditionalStaticData) {
        this.employeesStaticData = {
          ...this.employeesStaticData,
          ...this.employeesAdditionalStaticData,
        };
      }
      this.staticData = [
        {
          title: 'STATIC_DATA_VACATION_BALANCE',
          value: this.vacationType.value?.vacationBalance,
        },
        {
          title: this.employeesStaticData?.additionalVacationBalance.name,
          value: this.employeesStaticData?.additionalVacationBalance.value,
        },
        {
          title: this.employeesStaticData?.dayOffBalance.name,
          value: this.employeesStaticData?.dayOffBalance.value,
        },
      ];
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
              this.employeesStaticData[name].value
            ),
            title: this.employeesStaticData[name].name,
          });
        }
      }
    }
    if (changes.vacationBalanceByTypeID?.currentValue?.length) {
      this.setCopingValue();
    }
  }

  public validateDays(value: number): void {
    this.invalidNumDays = value > this.vacationType.value?.vacationBalance;
  }

  public sendForm(): void {
    this.formData = this.fb.group({
      vacationType: [this.vacationType.value.vacationID, [Validators.required]],
      AmountOfDays: [this.numOfDays.value, [Validators.required]],
    });
    if (!this.formData.invalid) {
      if (this.parentId) {
        this.issueFormSubmit.emit({
          ...this.formData.value,
          parentId: this.parentId,
        });
      } else {
        this.issueFormSubmit.emit(this.formData.value);
      }
    }
  }
}
