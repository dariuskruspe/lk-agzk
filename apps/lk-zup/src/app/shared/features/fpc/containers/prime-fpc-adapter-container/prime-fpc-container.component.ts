import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmployeesStaticDataManagerFacade } from '@features/employees/facades/employees-static-data-manager.facade';
import { EmployeesStaticDataFacade } from '@features/employees/facades/employees-static-data.facade';
import { IssuesFormFileFacade } from '@features/issues/facades/issues-form-file.facade';
import { VacationsGraphDayOffListFacade } from '@features/vacations/facades/vacations-graph-day-off-list.facade';
import { VacationsScheduleListFacade } from '@features/vacations/facades/vacations-schedule-list.facade';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { FileBase64 } from '@shared/models/files.interface';
import { logWarn } from '@shared/utilits/logger';
import {
  FpcInterface,
  OptionListInterface,
} from '@wafpc/base/models/fpc.interface';
import { Observable, Subject } from 'rxjs';
import { OptionListFacade } from '../../../option-list/facades/option-list.facade';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'fpc',
    templateUrl: './prime-fpc-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PrimeFpcAdapterContainerComponent implements OnInit, OnChanges {
  @Input() formData$: Subject<FpcInterface> | Observable<FpcInterface>;

  @Input() formData: FpcInterface;

  @Input() dateLocale;

  @Input() edit$: 'show' | 'edit';

  @Input() employeeId: string;

  @Input() loading: boolean;

  @Input() submit$: Subject<void> | Observable<void>;

  @Input() clear$: Subject<void> | Observable<void>;

  @Input() hasInitialPatching!: boolean;

  @Input() optionLists: OptionListInterface;

  @Input() fileBase64: string | FileBase64;

  @Output() formSubmit = new EventEmitter();

  @Output() formSubmitFailed = new EventEmitter();

  @Output() getFileEvent = new EventEmitter();

  @Output() submitDisabled = new EventEmitter();

  @Output() isInvalid = new EventEmitter<boolean>();

  @Output() showOptions = new EventEmitter<unknown[]>();

  @Output() valueChanged = new EventEmitter<unknown>();

  @Output() formBuilt = new EventEmitter<FormGroup>();

  constructor(
    public optionListFacade: OptionListFacade,
    public issuesFormFileFacade: IssuesFormFileFacade,
    public daysOffFacade: VacationsGraphDayOffListFacade,
    public scheduleListFacade: VacationsScheduleListFacade,
    public langFacade: LangFacade,
    public staticDataFacade: EmployeesStaticDataFacade,
    public staticDataManagerFacade: EmployeesStaticDataManagerFacade,
  ) {}

  ngOnInit(): void {
    this.staticDataFacade.getStaticDataOnce();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formData?.currentValue) {
      // eslint-disable-next-line no-console
      logWarn(
        'formData is deprecated! Please use immutable structure with observable formData$',
      );
    }
  }

  openStaticFile(id: string): void {
    this.issuesFormFileFacade.showIssueFileOwnerBase64({
      id,
      ownerType: 'issueType',
    });
  }

  getFile(id: string): void {
    this.getFileEvent.emit(id);
  }

  onSubmit(value: FormGroup): void {
    this.formSubmit.emit(value);
  }

  onSubmitFailed($event: { form: FormGroup }): void {
    this.formSubmitFailed.emit($event);
  }

  onSubmitDisable(disabled: boolean): void {
    this.submitDisabled.next(disabled);
  }

  onInvalid(invalid: boolean): void {
    this.isInvalid.emit(invalid);
  }

  onShowOptions(optionAliases: any[]): void {
    setTimeout(() => {
      this.optionListFacade.showOptionLists(optionAliases, this.employeeId);
    }, 1);
  }

  onValueChanged(event: any): void {
    this.valueChanged.emit(event);
  }

  onFormBuilt(event: FormGroup): void {
    this.formBuilt.emit(event);
  }

  onEmployeeChanged({
    employeeId,
    fields,
  }: {
    employeeId: string;
    fields: string[];
  }): void {
    if (!!employeeId && fields?.length) {
      this.staticDataManagerFacade.getStaticData(employeeId, fields);
    }
  }
}
