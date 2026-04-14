import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { OptionListFacade } from '../../../../../shared/features/option-list/facades/option-list.facade';
import { AbstractCustomIssueComponent } from '../abstract-custom-issue/abstract-custom-issue.component';

@Component({
    selector: 'app-issues-add-insurance',
    templateUrl: '../abstract-custom-issue/default-custom-issue.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddInsuranceComponent
  extends AbstractCustomIssueComponent
  implements OnChanges
{
  private readonly INSURANCE_CONTROL_NAME = 'insuranceProgram';

  private readonly CONTROLS_DEPEND_ON_INSURANCE = ['clinic', 'dentalClinic'];

  constructor(
    protected fb: FormBuilder,
    public optionListFacade: OptionListFacade
  ) {
    super(fb, optionListFacade);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.issuesType?.currentValue) {
      this.sourceFormData = { ...changes.issuesType?.currentValue };
      const formData = { ...this.sourceFormData };
      formData.template = this.sourceFormData.template.map((item) => ({
        ...item,
        optionListRequestAlias: this.CONTROLS_DEPEND_ON_INSURANCE.includes(
          item.formControlName
        )
          ? ''
          : item.optionListRequestAlias,
        disabled: this.CONTROLS_DEPEND_ON_INSURANCE.includes(
          item.formControlName
        ),
      }));
      this.sourceFormDataSubj.next(formData);
    }
  }

  onFormBuilt(form: FormGroup): void {
    form
      .get(this.INSURANCE_CONTROL_NAME)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          const optionAliases = [];
          const formData = {
            ...this.sourceFormData,
            template: this.sourceFormData.template.map((item) => {
              const alias = `${item.optionListRequestAlias}?owner=${value}`;
              if (
                this.CONTROLS_DEPEND_ON_INSURANCE.includes(item.formControlName)
              ) {
                optionAliases.push(alias);
                return {
                  ...item,
                  optionListRequestAlias: alias,
                };
              }
              return item;
            }),
          };
          this.sourceFormDataSubj.next(formData);
          this.optionListFacade.show(optionAliases);
          this.CONTROLS_DEPEND_ON_INSURANCE.forEach((controlName) => {
            form.get(controlName).enable();
          });
        } else {
          this.CONTROLS_DEPEND_ON_INSURANCE.forEach((controlName) => {
            form.get(controlName).disable();
            form.get(controlName).setValue('');
          });
        }
      });
  }
}
