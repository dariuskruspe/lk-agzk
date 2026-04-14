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
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { MathCurrentDateDayUtils } from '@shared/utilits/math-current-date-day.utils';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import moment, { Moment } from 'moment';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IssuesDynamicFieldsCommonComponent } from '../issues-add-dynamic-fields-common/issues-add-dynamic-fields-common.component';
import {toUnzonedDate} from "@shared/utilits/to-unzoned-date.util";

@Component({
    selector: 'app-issues-add-business-trip',
    templateUrl: './issues-add-business-trip.component.html',
    styleUrls: ['./issues-add-business-trip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddBusinessTripComponent
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
  ];

  @Input() dayOff;

  @Input() dateLocale: string;

  @Input() issuesOptionLists;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() loading: boolean;

  @Input() employeesApprovingPersons: string[];

  @Output() issueFormSubmit = new EventEmitter();

  @Output() toggleDateControls = new EventEmitter();

  @Output() getOptionLists = new EventEmitter();

  constructor(
    protected fb: FormBuilder,
    public mathDayUtils: MathCurrentDateDayUtils
  ) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.form &&
      changes.loading &&
      typeof changes.loading.currentValue === 'boolean'
    ) {
      if (this.loading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
    super.ngOnChanges(changes);
    if (
      changes.dayOff &&
      changes.dayOff.currentValue &&
      typeof changes.dayOff.currentValue.isDayOff === 'boolean'
    ) {
      this.toggleCompensationControls(changes.dayOff.currentValue.isDayOff);
    }
  }

  ngOnInit(): void {
    this.initForm();
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
    this.getOptionLists.emit(['purpose', 'weekendCompensation']);
  }

  initForm(): void {
    this.form = this.fb.group({
      dateBegin: [''],
      dateEnd: [''],
      message: [''],
      stateCity: [''],
      purpose: [''],
    });
  }

  dateBinding(
    formControlName: string,
    value: string,
    formControlNameBuffer?: string
  ): void {
    if (formControlNameBuffer) {
      this.dateValidation(formControlNameBuffer, moment(value));
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

  toggleCompensationControls(value: boolean): void {
    if (value) {
      this.form.addControl(
        this.formControlNameBuffer.formControlName,
        this.fb.control('', [Validators.required])
      );
    } else {
      switch (this.formControlNameBuffer.formControlName) {
        case 'payType1':
          this.form.removeControl('dayOff1');
          this.form.removeControl(this.formControlNameBuffer.formControlName);
          break;
        case 'payType2':
          this.form.removeControl('dayOff2');
          this.form.removeControl(this.formControlNameBuffer.formControlName);
          break;
        default:
          break;
      }
    }
  }

  changePayType(event: { value: string }, payControlNumber: number): void {
    const option = this.issuesOptionLists.weekendCompensation.optionList.find(
      (e) => e.value === event.value
    );
    if (option && option.flag === 'tr-1') {
      this.form.addControl(
        `dayOff${payControlNumber}`,
        this.fb.control('', [Validators.required])
      );
    } else {
      this.form.removeControl(`dayOff${payControlNumber}`);
    }
  }

  togglePurposeOtherControl(formControlName: string, value: string): void {
    const option = this.issuesOptionLists.purpose.optionList.find(
      (e) => e.value === value
    );
    if (option && option.flag === 'tr-1') {
      this.form.addControl(
        formControlName,
        this.fb.control('', [Validators.required])
      );
    } else {
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

  toDate(value: string[] | string): (Date | null)[] | (Date | null) {
    // eslint-disable-next-line no-nested-ternary
    return Array.isArray(value)
      ? value.map((item) => (item ? new Date(item) : null))
      : value
      ? new Date(value)
      : null;
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
