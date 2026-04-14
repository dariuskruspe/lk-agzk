import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { VacationsGraphDayOffListFacade } from '@features/vacations/facades/vacations-graph-day-off-list.facade';
import { OptionListFacade } from '@shared/features/option-list/facades/option-list.facade';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { ValidatorsUtils } from '@wafpc/base/utils/validators.utils';
import { ReplaySubject, Subject, UnaryFunction } from 'rxjs';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';

@Component({
    // Use this html-template to show source issue template
    template: './default-custom-issue.component.html',
    standalone: false
})
export class AbstractCustomIssueComponent implements OnChanges, OnDestroy {
  protected submit$$ = new Subject<void>();

  readonly submit$ = this.submit$$.asObservable();

  sourceFormData: FpcInterface;

  sourceFormDataSubj = new ReplaySubject<FpcInterface>();

  sourceFormData$ = this.sourceFormDataSubj.asObservable();

  @Input() dateLocale: string;

  @Input() loading: boolean;

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() employeesApprovingPersons: string[];

  @Output() issueFormSubmit = new EventEmitter();

  @Output() goBack = new EventEmitter<void>();

  protected destroy$ = new Subject<void>();

  protected templatedForm: FormGroup;

  protected daysOffFacade = inject(VacationsGraphDayOffListFacade);

  protected validatorUtils = new ValidatorsUtils(undefined, {
    daysOff: this.daysOffFacade.getData(),
  } as any);

  constructor(
    protected fb: FormBuilder,
    @Optional() public optionListFacade?: OptionListFacade
  ) {}

  ngOnChanges({ issuesType }: SimpleChanges): void {
    if (issuesType?.currentValue) {
      this.sourceFormData = {
        ...issuesType?.currentValue,
      };
      this.sourceFormDataSubj.next(this.sourceFormData);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.submit$$.next();
  }

  handleSubmit(value: FormGroup): void {
    this.issueFormSubmit.emit(value);
  }

  onBackPage(): void {
    this.goBack.emit();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFpcChange(event: unknown): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
  onFormBuilt(form: FormGroup): void {
    this.templatedForm = form;
  }

  touchForm(): void {
    this.templatedForm.markAllAsTouched?.();
    this.templatedForm.markAsTouched?.();
    this.templatedForm.markAsDirty?.();
    this.submit$$.next();
  }

  protected doWithTemplate(
    formData: FpcInputsInterface[],
    cb: UnaryFunction<FpcInputsInterface, void>
  ): void {
    for (const item of formData) {
      cb(item);
      if (this.isArrSmart(item)) {
        this.doWithTemplate(item.arrSmartList, cb);
      }
    }
  }

  protected isArrSmart(obj: FpcInputsInterface): boolean {
    return obj.type === 'arr-smart' && !!obj.arrSmartList;
  }

  protected markAsTouched(group: FormGroup | FormArray): void {
    const controls = Array.isArray(group.controls)
      ? group.controls
      : Object.values(group.controls);
    for (const control of controls) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();

      if (this.isFormGroupOrArray(control)) {
        this.markAsTouched(control);
      }
    }
  }

  private isFormGroupOrArray(
    obj: AbstractControl
  ): obj is FormGroup | FormArray {
    if ('controls' in obj) {
      return true;
    }
    return false;
  }
}
