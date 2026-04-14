import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import moment, { Moment } from 'moment';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IssuesDynamicFieldsCommonComponent } from '../issues-add-dynamic-fields-common/issues-add-dynamic-fields-common.component';
import {toUnzonedDate} from "@shared/utilits/to-unzoned-date.util";

@Component({
    selector: 'app-issues-add-overtime-work',
    templateUrl: './issues-add-overtime-work.component.html',
    styleUrls: ['./issues-add-overtime-work.component.scss'],
    standalone: false
})
export class IssuesAddOvertimeWorkComponent
  extends IssuesDynamicFieldsCommonComponent
  implements OnChanges, OnInit
{
  readonly existingFields = ['dateBegin', 'payType1', 'message'];

  @Input() dayOff;

  @Input() dateLocale: string;

  @Input() optionLists;

  @Input() issuesOptionLists;

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() employeesApprovingPersons: string[];

  @Output() toggleDateControls = new EventEmitter();

  @Output() getOptionLists = new EventEmitter();

  constructor(protected fb: FormBuilder) {
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
  }

  ngOnInit(): void {
    this.initForm();
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

  dateBinding(formControlNameBuffer: string, value: string): void {
    if (formControlNameBuffer) {
      this.dateValidation(formControlNameBuffer, moment(value));
    }
  }

  dateValidation(formControlName: string, date: Moment): void {
    this.formControlNameBuffer = { formControlName };
    this.toggleDateControls.emit(date);
  }

  changePayType(event: MatSelectChange, payControlNumber: number): void {
    const option = this.issuesOptionLists.weekendCompensation.optionList.find(
      (e) => e.value === event.value
    );
    if (option?.flag === 'tr-1') {
      this.form.addControl(
        `dayOff${payControlNumber}`,
        this.fb.control('', [Validators.required])
      );
    } else {
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
      this.form.removeControl(this.formControlNameBuffer.formControlName);
    }
  }

  togglePurposeOtherControl(formControlName: string, value: string): void {
    if (value === 'Другое (указать цель самостоятельно)') {
      this.form.addControl(
        formControlName,
        this.fb.control('', [Validators.required])
      );
    } else {
      this.form.removeControl(formControlName);
    }
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
