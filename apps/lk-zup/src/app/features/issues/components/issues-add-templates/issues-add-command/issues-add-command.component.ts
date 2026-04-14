import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FpcInputsInterface,
  ValidationTypes,
} from '@wafpc/base/models/fpc.interface';
import { ValidatorsUtils } from '@wafpc/base/utils/validators.utils';
import moment, { Moment } from 'moment';
import { SettingsInterface } from '../../../../../shared/features/settings/models/settings.interface';
import { MathCurrentDateDayUtils } from '../../../../../shared/utilits/math-current-date-day.utils';
import { MainCurrentUserInterface } from '../../../../main/models/main-current-user.interface';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IssuesDynamicFieldsCommonComponent } from '../issues-add-dynamic-fields-common/issues-add-dynamic-fields-common.component';
import {toUnzonedDate} from "@shared/utilits/to-unzoned-date.util";

@Component({
    selector: 'app-issues-add-command',
    templateUrl: './issues-add-command.component.html',
    styleUrls: ['./issues-add-command.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddCommandComponent
  extends IssuesDynamicFieldsCommonComponent
  implements OnInit, OnChanges
{
  readonly existingFields = [
    'dateBegin',
    'payType1',
    'dayOff1',
    'dateEnd',
    'payType2',
    'dayOff2',
    'stateCity',
    'purpose',
    'purposeOther',
    'message',
    'organization',
    'expenses',
    'basis',
    'basisOther',
    'files',
  ];

  @Input() dayOff;

  @Input() dateLocale: string;

  @Input() issuesOptionLists;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() settings: SettingsInterface;

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() loading: boolean;

  @Input() employeesApprovingPersons: string[];

  @Output() issueFormSubmit = new EventEmitter();

  @Output() toggleDateControls = new EventEmitter();

  @Output() getOptionLists = new EventEmitter();

  constructor(
    protected fb: FormBuilder,
    private validatorsUtils: ValidatorsUtils,
    public mathDayUtils: MathCurrentDateDayUtils
  ) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (
      changes.dayOff &&
      changes.dayOff.currentValue &&
      typeof changes.dayOff.currentValue.isDayOff === 'boolean'
    ) {
      this.toggleCompensationControls(changes.dayOff.currentValue.isDayOff);
    }
    if (this.form && changes?.issuesType?.currentValue) {
      for (const control of this.issuesType.template) {
        if (
          this.form.get(control.formControlName) &&
          control?.validations?.length
        ) {
          this.addValidators(control.formControlName, control.validations);
        }
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.settings?.businessTrips?.organizationEnable) {
      this.form.addControl(
        'organization',
        this.fb.control('', [Validators.required])
      );
    }
    if (this.settings?.businessTrips?.expensesEnable) {
      this.form.addControl(
        'expenses',
        this.fb.control('', [Validators.required])
      );
    }
    if (this.settings?.businessTrips?.basisEnable) {
      this.form.addControl('basis', this.fb.control('', [Validators.required]));
    }
    this.getOptionLists.emit([
      'purpose',
      'weekendCompensation',
      'expenses',
      'basis',
    ]);
    const data = localStorage.getItem('issue_data')
      ? JSON.parse(localStorage.getItem('issue_data'))
      : null;
    localStorage.removeItem('issue_data');
    if (data) {
      this.parentId = data.parentId;
      this.form.patchValue({
        ...data,
        dateBegin: new Date(data.dateBegin),
        dateEnd: new Date(data.dateEnd),
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      dateBegin: [''],
      dateEnd: [''],
      message: [''],
      stateCity: [''],
      purpose: [''],
      files: [''],
    });
  }

  addValidators(controlName: string, validators: ValidationTypes[0][]): void {
    this.form.controls[controlName].setValidators(
      this.validatorsUtils.getList({
        validations: validators,
        formControlName: controlName,
      } as FpcInputsInterface)
    );
  }

  dateBinding(payTypeName: string, value: string): void {
    if (payTypeName) {
      this.dateValidation(payTypeName, moment(value));
    }
  }

  dateValidation(formControlName: string, date: Moment): void {
    this.formControlNameBuffer = { formControlName };
    if (this.form.get('dateBegin')?.value && this.form.get('dateEnd')?.value) {
      if (
        new Date(this.form.get('dateBegin')?.value)?.toISOString() !==
        new Date(this.form.get('dateEnd')?.value)?.toISOString()
      ) {
        this.toggleDateControls.emit(date);
      }
    } else {
      this.toggleDateControls.emit(date);
    }
  }

  changePayType(event: { value: string }, payControlNumber: number): void {
    const option = this.issuesOptionLists.weekendCompensation.optionList.find(
      (e) => e.value === event.value
    );
    if (option?.flag === 'tr-1') {
      this.form.addControl(
        `dayOff${payControlNumber}`,
        this.fb.control('', [Validators.required])
      );
    } else {
      this.form.get(`dayOff${payControlNumber}`)?.clearValidators();
      this.form.removeControl(`dayOff${payControlNumber}`);
    }
  }

  toggleCompensationControls(value: boolean): void {
    if (value) {
      this.form.addControl(
        this.formControlNameBuffer.formControlName,
        this.fb.control('', [Validators.required])
      );
    } else {
      switch (this.formControlNameBuffer.formControlName) {
        case 'payType1':
          this.form.get('dayOff1')?.clearValidators();
          this.form.removeControl('dayOff1');
          this.form.removeControl(this.formControlNameBuffer.formControlName);
          break;
        case 'payType2':
          this.form.get('dayOff2')?.clearValidators();
          this.form.removeControl('dayOff2');
          this.form.removeControl(this.formControlNameBuffer.formControlName);
          break;
        default:
          break;
      }
    }
  }

  toggleOtherControl(
    formControlName: string,
    value: string,
    optionName: string
  ): void {
    const option = this.issuesOptionLists[optionName].optionList.find(
      (e) => e.value === value
    );
    if (option && option.flag === 'tr-1') {
      this.form.addControl(
        formControlName,
        this.fb.control('', [Validators.required])
      );
    } else {
      this.form.get(formControlName)?.clearValidators();
      this.form.removeControl(formControlName);
    }
  }

  findTemplateItem(formControlName: string): FpcInputsInterface {
    if (this.issuesType) {
      return this.issuesType.template.find(
        (e) => e.formControlName === formControlName
      );
    }
    return null;
  }

  getNextDay(date: string): Date {
    return new Date(
      new Date(date).getFullYear(),
      new Date(date).getMonth(),
      new Date(date).getDate() + 1,
      0,
      0,
      0
    );
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
