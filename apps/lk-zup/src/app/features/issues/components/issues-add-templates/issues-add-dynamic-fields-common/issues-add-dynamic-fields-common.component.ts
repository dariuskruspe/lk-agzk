import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { Environment } from '../../../../../shared/classes/ennvironment/environment';
import { AbstractCustomIssueComponent } from '../abstract-custom-issue/abstract-custom-issue.component';

@Component({
    selector: 'app-issues-dynamic-fields-common',
    template: '',
    standalone: false
})
export class IssuesDynamicFieldsCommonComponent
  extends AbstractCustomIssueComponent
  implements OnChanges
{
  readonly existingFields = [];

  modifiedFormData: FpcInterface;

  form: FormGroup;

  formControlNameBuffer: {
    formControlName: string;
    index?: number;
  };

  parentId: string;

  readonly isMobile = Environment.isMobileApp();

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  ngOnChanges({ issuesType, loading }: SimpleChanges): void {
    if (this.form && loading && typeof loading.currentValue === 'boolean') {
      if (loading.currentValue) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }

    if (issuesType?.currentValue) {
      this.modifiedFormData = {
        ...issuesType.currentValue,
      };

      this.modifiedFormData.template = this.modifiedFormData.template.filter(
        (template) => !this.existingFields.includes(template.formControlName)
      );

      issuesType.currentValue.template.forEach((field: FpcInputsInterface) => {
        const validatorFunctions =
          field.validations?.map((validator: any) => {
            let key: string = validator;
            let value;
            if (typeof validator === 'object') {
              key = Object.keys(validator)[0];
              value = validator[key];
            }
            return value ? Validators[key]?.(value) : Validators[key];
          }) || [];
        this.form.get(field.formControlName)?.setValidators(validatorFunctions);
      });
    }
  }

  onSubmit(): void {
    for (const inner of Object.keys(this.form.controls)) {
      this.form.get(inner).markAsDirty();
      this.form.get(inner).markAsTouched();
      this.form.get(inner).updateValueAndValidity();
    }
    this.submit$$.next();
  }

  handleSubmit(additionalFormValue: FormGroup): void {
    if (this.form.valid) {
      const formResult = {
        ...this.form.value,
        ...additionalFormValue,
      };
      // todo SDKIS-38749 причину преобразования даты в ISO формат при указанном UFC
      if (formResult.dateBegin) {
        formResult.dateBegin = this.toFixDate(formResult.dateBegin);
      }
      if (formResult.dateEnd) {
        formResult.dateEnd = this.toFixDate(formResult.dateEnd);
      }
      if (formResult.dayOff1) {
        formResult.dayOff1 = this.toFixDate(formResult.dayOff1);
      }
      if (formResult.dayOff2) {
        formResult.dayOff2 = this.toFixDate(formResult.dayOff2);
      }

      if (formResult.weekendWork) {
        const arr = [];
        formResult.weekendWork.value.forEach((el: any) => {
          if (el.dateBegin) {
            // eslint-disable-next-line no-param-reassign
            el.dateBegin = this.toFixDate(el.dateBegin);
          }
          if (el.dayOff1) {
            // eslint-disable-next-line no-param-reassign
            el.dayOff1 = this.toFixDate(el.dayOff1);
          }
          arr.push(el);
        });
        formResult.weekendWork = arr;
      }
      if (this.parentId) {
        this.issueFormSubmit.emit({ ...formResult, parentId: this.parentId });
      } else {
        this.issueFormSubmit.emit(formResult);
      }
    } else {
      for (const inner of Object.keys(this.form.controls)) {
        this.form.get(inner).markAsDirty();
        this.form.get(inner).markAsTouched();
        this.form.get(inner).updateValueAndValidity();
      }
    }
  }

  toFixDate(date: Date | string): Date | string {
    const month =
      `${new Date(date).getMonth() + 1}`.length === 1
        ? `0${new Date(date).getMonth() + 1}`
        : new Date(date).getMonth() + 1;
    const day =
      `${new Date(date).getDate()}`.length === 1
        ? `0${new Date(date).getDate()}`
        : new Date(date).getDate();
    return `${new Date(date).getFullYear()}-${month}-${day}T00:00:00.000Z`;
  }

  toDate(value: string[] | string): (Date | null)[] | (Date | null) {
    // eslint-disable-next-line no-nested-ternary
    return Array.isArray(value)
      ? value.map((item) => (item ? new Date(item) : null))
      : value
      ? new Date(value)
      : null;
  }

  onBackPage(): void {
    this.goBack.emit();
  }

  findTemplateItem(formControlName: string): FpcInputsInterface {
    if (this.issuesType) {
      return this.issuesType.template.find(
        (e) => e.formControlName === formControlName
      );
    }
    return null;
  }

  findDayTemplate(formControlName: string): FpcInputsInterface {
    if (this.issuesType) {
      const smartArr = this.issuesType?.template.find(
        (e) => e.type === 'arr-smart'
      );
      return smartArr
        ? smartArr.arrSmartList.find(
            (e) => e.formControlName === formControlName
          )
        : null;
    }
    return null;
  }
}
