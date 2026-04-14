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
    selector: 'app-issues-add-personnel-transfer',
    templateUrl: '../abstract-custom-issue/default-custom-issue.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesAddPersonnelTransferComponent
  extends AbstractCustomIssueComponent
  implements OnChanges
{
  private readonly DEPENDING_CONTROLS = [
    {
      controlName: 'organization',
      lists: ['division', 'territory'],
      param: 'owner',
      value: '',
    },
    {
      controlName: 'division',
      lists: ['staffingTable'],
      param: 'owner',
      value: '',
    },
    {
      controlName: 'territory',
      lists: ['staffingTable'],
      param: 'project',
      value: '',
    },
    {
      controlName: 'territory',
      lists: ['division'],
      param: 'project',
      value: '',
    },
  ];

  private buffered = new Map<string, string>();

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
        optionListRequestAlias:
          this.isDependant(item.formControlName) && !item.optionListRequestParams?.length
            ? ''
            : item.optionListRequestAlias,
        disabled: this.isDependant(item.formControlName),
      }));
      this.sourceFormDataSubj.next(formData);
    }
  }

  onFormBuilt(form: FormGroup): void {
    this.DEPENDING_CONTROLS.forEach((control) => {
      form
        .get(control.controlName)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          // eslint-disable-next-line no-param-reassign
          control.value = value;

          if (value) {
            const optionAliases = [];
            const formData = {
              ...this.sourceFormData,
              template: this.sourceFormData.template.map((item) => {
                const [params, isChanged] = this.getDependencies(
                  item.formControlName
                );

                if (params) {
                  const alias = item.optionListRequestAlias
                    ? `${item.optionListRequestAlias}?${params}`
                    : '';
                  if (isChanged) {
                    optionAliases.push(alias);
                  }

                  return {
                    ...item,
                    optionListRequestAlias: alias,
                  };
                }
                return item;
              }),
            };
            this.sourceFormDataSubj.next(formData);
            if (optionAliases.length) {
              this.optionListFacade.showOptionLists(optionAliases);
            }
            control.lists.forEach((controlName) => {
              form.get(controlName)?.enable();
            });
          } else {
            control.lists.forEach((controlName) => {
              form.get(controlName)?.disable();
              form.get(controlName)?.setValue('');
            });
          }
        });
    });
  }

  private isDependant(controlName: string): boolean {
    return this.DEPENDING_CONTROLS.some((item) =>
      item.lists.includes(controlName)
    );
  }

  private getDependencies(controlName: string): [string, boolean] {
    const params = this.DEPENDING_CONTROLS.filter(
      (item) => item.lists.includes(controlName) && !!item.value && !!item.param
    )
      .sort((a, b) => {
        if (a.param < b.param) {
          return -1;
        }
        if (a.param > b.param) {
          return 1;
        }
        return 0;
      })
      .reduce((acc, item) => {
        const param = `${item.param}=${item.value}`;
        return acc ? `${acc}&${param}` : param;
      }, '');

    let changed = false;
    const buffer = this.buffered.get(controlName);
    if (!buffer || (buffer && buffer !== params)) {
      this.buffered.set(controlName, params);
      changed = true;
    }

    return [params, changed];
  }
}
