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
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { SettingsFacade } from '../../../../../shared/features/settings/facades/settings.facade';
import { SettingsInterface } from '../../../../../shared/features/settings/models/settings.interface';
import { MathCurrentDateDayUtils } from '../../../../../shared/utilits/math-current-date-day.utils';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IssuesDynamicFieldsCommonComponent } from '../issues-add-dynamic-fields-common/issues-add-dynamic-fields-common.component';
import {toUnzonedDate} from "@shared/utilits/to-unzoned-date.util";

export interface WeekendForm {
  dateBegin: string;
  hoursWorked: string;
  payType1: string;
  dayOff1: string;
}

@Component({
    selector: 'app-issues-add-weekend-hourly',
    templateUrl: './issues-add-weekend-hourly.component.html',
    styleUrls: ['./issues-add-weekend-hourly.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddWeekendHourlyComponent
  extends IssuesDynamicFieldsCommonComponent
  implements OnChanges, OnInit
{
  readonly existingFields = [
    'dateBegin',
    'payType1',
    'hoursWorked',
    'dayOff1',
    'message',
    'basisweekend',
    'basisOther',
    'weekendWork',
  ];

  startDayOff;

  weekendLimit = 12;

  @Input() dayOff;

  @Input() dateLocale: string;

  @Input() optionLists;

  @Input() issuesOptionLists;

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() employeesApprovingPersons: string[];

  @Output() toggleDateControls = new EventEmitter();

  @Output() getOptionLists = new EventEmitter();

  @Input() settings: SettingsInterface;

  selectedItem: string;

  constructor(
    protected fb: FormBuilder,
    public mathDayUtils: MathCurrentDateDayUtils,
    public settingsFacade: SettingsFacade
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
      if (typeof this.formControlNameBuffer !== 'undefined') {
        const i = this.formControlNameBuffer.index;
        const name = this.formControlNameBuffer.formControlName;
        if (
          !changes.dayOff.currentValue.isDayOff &&
          !name.startsWith('dayOff')
        ) {
          this.form
            .get('weekendWork')
            .value.controls[i].get(name)
            .setErrors({ hasDayOff: 'VALIDATOR_HAS_DAY_OFF' });
        } else {
          this.form
            .get('weekendWork')
            .value.controls[i].get(name)
            .setErrors(null);
        }
      } else if (!changes.dayOff.currentValue.isDayOff) {
        this.form.get('dateBegin').setErrors({ hasDayOff: true });
      } else {
        this.form.get('dateBegin').setErrors(null);
      }
    }

    if (changes.issuesOptionLists?.currentValue?.weekendCompensation) {
      this.setCopingValue(this.form.value.weekendWork.value);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getOptionLists.emit(['weekendCompensation', 'basisweekend']);
    this.addWeekendWork(this.form.value.weekendWork.value);
  }

  public myFilter = (d: Date): boolean => {
    const buffer = this.formControlNameBuffer;
    const day = this.form
      .get('weekendWork')
      .value.controls[buffer?.index].get('dateBegin').value;
    return day < d;
  };

  initForm(): void {
    this.form = this.fb.group({
      weekendWork: [
        this.fb.array([], Validators.required),
        Validators.required,
      ],
      message: [''],
    });
    if (this.settingsFacade.getData()?.weekendWork?.basisEnable) {
      this.form.addControl(
        'basisweekend',
        this.fb.control('', [Validators.required])
      );
    }
  }

  get weekendWork(): FormArray {
    return this.form.get('weekendWork').value as FormArray;
  }

  removeSmartFormGroup(i: number): void {
    this.form.value.weekendWork.removeAt(i);
  }

  dateBinding(formControlName: string, value: string, i: number): void {
    this.dateValidation(formControlName, value, i);
  }

  dateValidation(formControlName: string, date: string, index: number): void {
    this.formControlNameBuffer = { formControlName, index };
    this.toggleDateControls.emit(date);
  }

  changePayType(
    event: { value: string },
    payControlNumber: number,
    i: number
  ): void {
    const dayError = this.form
      .get('weekendWork')
      .value.controls[i].get('dateBegin').errors;
    const option = this.issuesOptionLists.weekendCompensation.optionList.find(
      (e) => e.value === event.value
    );
    if (option && option.flag === 'tr-1') {
      this.form
        .get('weekendWork')
        .value.controls[i].addControl(
          `dayOff${payControlNumber}`,
          this.fb.control('', [Validators.required])
        );
    } else {
      this.form
        .get('weekendWork')
        .value.controls[i].removeControl(`dayOff${payControlNumber}`);
    }
    if (dayError) {
      this.form
        .get('weekendWork')
        .value.controls[i].get('dateBegin')
        .setErrors(dayError);
    }
    if (event.value === 'Двойная оплата') {
      this.selectedItem = this.form.value.weekendWork.value[0].payType1;
      this.form.value.weekendWork.controls.forEach((c) => {
        c.removeControl(`dayOff${payControlNumber}`);
      });
      this.weekendWork.controls.forEach((control) => {
        control.setValue({
          dateBegin: control.value.dateBegin,
          payType1: this.selectedItem,
          hoursWorked: control.value.hoursWorked,
        });
      });
    }
    if (event.value === 'Дополнительный выходной') {
      this.selectedItem = this.form.value.weekendWork.value[0].payType1;
      if (this.settings.weekendWork.isDayOffDateRequired) {
        this.form.value.weekendWork.controls.forEach((c) => {
          c.addControl(
            `dayOff${payControlNumber}`,
            new FormControl('', Validators.required)
          );
        });
      }
      this.weekendWork.controls.forEach((control) => {
        control.patchValue({
          dateBegin: control.value.dateBegin,
          payType1: this.selectedItem,
          hoursWorked: control.value.hoursWorked,
        });
      });
    }
  }

  checkDisabling(form: WeekendForm[], index: number): boolean {
    return form[0].payType1 && index > 0;
  }

  addWeekendWork(form: WeekendForm[]): void {
    this.form.value.weekendWork.push(
      this.fb.group({
        dateBegin: ['', [Validators.required]],
        hoursWorked: ['', [Validators.required]],
        payType1: [form[0]?.payType1 || '', Validators.required],
      })
    );
    if (
      form[0] &&
      form[0].payType1 === 'Дополнительный выходной' &&
      this.settings.weekendWork.isDayOffDateRequired
    ) {
      this.form.value.weekendWork.controls.forEach((c) => {
        c.addControl(`dayOff1`, new FormControl('', Validators.required));
      });
    }
  }

  setCopingValue(form: WeekendForm[]): void {
    const data = localStorage.getItem('issue_data')
      ? JSON.parse(localStorage.getItem('issue_data'))
      : null;
    localStorage.removeItem('issue_data');
    if (data) {
      this.parentId = data.parentId;
      this.form.get('message').setValue(data.message);
      this.form.get('basisweekend').setValue(data.basisweekend);
      for (let i = 0; i < data.weekendWork.length - 1; i += 1) {
        this.form.value.weekendWork.push(
          this.fb.group({
            dateBegin: ['', [Validators.required]],
            hoursWorked: ['', [Validators.required]],
            payType1: [form[0]?.payType1 || '', Validators.required],
          })
        );
      }
      this.weekendWork.controls.forEach((control, index) => {
        control.patchValue({
          dateBegin: new Date(data.weekendWork[index].dateBegin),
          payType1: data.weekendWork[index].payType1,
          hoursWorked: data.weekendWork[index].hoursWorked,
        });

        this.changePayType(
          { value: data.weekendWork[index].payType1 },
          1,
          index
        );

        if (data.weekendWork[index].dayOff1) {
          control.patchValue({
            dayOff1: new Date(data.weekendWork[index].dayOff1),
          });
        }
      });
    }
  }

  toggleBasisOtherControl(formControlName: string, value: string): void {
    const option = this.optionLists.basisweekend.optionList.find(
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

  getValidWeekendWork(): boolean {
    for (const item of (<FormArray>this.form.get('weekendWork'))?.value
      ?.controls ?? []) {
      for (const key of Object.keys(item.controls)) {
        item.controls[key].markAsTouched();
        item.controls[key].markAsDirty();
        item.controls[key].updateValueAndValidity();
      }
      if (!item.valid) {
        return false;
      }
    }
    return true;
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
