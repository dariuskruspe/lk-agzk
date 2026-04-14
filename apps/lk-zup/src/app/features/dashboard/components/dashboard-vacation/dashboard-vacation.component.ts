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
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '../../../../shared/dictionaries/calendar-locale.dictionary';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import { IssuesTypesTemplateInterface } from '../../../issues/models/issues-types.interface';
import {
  IssuesStatusInterface,
  IssuesStatusListInterface,
} from '../../../issues/models/issues.interface';
import { VacationTypeInterface } from '../../../vacations/models/vacations-types.interface';
import {
  DashboardVacationInterface,
  DashboardVacationTotalInterface,
} from '../../models/dashboard-vacation.interface';
import {toUnzonedDate} from "@shared/utilits/to-unzoned-date.util";

const locale = {
  en: CALENDER_CONFIG_EN,
  ru: CALENDER_CONFIG_RU,
};

@Component({
    selector: ' app-dashboard-vacation',
    templateUrl: './dashboard-vacation.component.html',
    styleUrls: ['./dashboard-vacation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DashboardVacationComponent implements OnInit, OnChanges {
  vacationBalanceDateForm: FormGroup;

  minDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);

  maxDate: Date = new Date(new Date().getFullYear() + 2, 11, 31);

  @Input() dateLocale: string;

  @Input() vacationArray: DashboardVacationInterface;

  @Input() vacationTotal: DashboardVacationTotalInterface;

  @Input() issueType: IssuesTypesTemplateInterface;

  @Input() settings: SettingsInterface;

  @Input() vacationTypes: VacationTypeInterface[] = [];

  @Output() vacationBalanceDateUpdate = new EventEmitter();

  @Output() openIssue = new EventEmitter();

  @Output() openCreatedIssue = new EventEmitter<string>();

  @Output() openVacationImgDialog = new EventEmitter();

  @Input() isEnabled: boolean | undefined;

  @Input() showVacationBalances: boolean = true;

  @Input() showMyVacationSchedule: boolean = true;

  @Input() issueStateList: IssuesStatusInterface;

  constructor(
    // Other
    private fb: FormBuilder,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    public settingsFacade: SettingsFacade,
    public config: PrimeNGConfig,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateLocale && changes.dateLocale.currentValue) {
      this.config.setTranslation(locale[changes.dateLocale.currentValue]);
    }
  }

  ngOnInit(): void {
    this.config.setTranslation(locale[this.dateLocale]);
    this.initForm();
  }

  initForm(): void {
    this.vacationBalanceDateForm = this.fb.group({
      date: [{ value: new Date(), disabled: false }],
    });
  }

  dateBinding(formControlName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const obj = {};
    let separator;
    let dateSplit;
    switch (true) {
      case target.value.indexOf('.') > -1:
        separator = '.';
        dateSplit = target.value.split(separator);
        obj[formControlName] = new Date(
          Date.UTC(+dateSplit[2], +dateSplit[1] - 1, +dateSplit[0]),
        );
        this.vacationBalanceDateForm.patchValue(obj);
        break;
      case target.value.indexOf('/') > -1:
        separator = '/';
        dateSplit = target.value.split(separator);
        obj[formControlName] = new Date(
          Date.UTC(+dateSplit[2], +dateSplit[0] - 1, +dateSplit[1]),
        );
        this.vacationBalanceDateForm.patchValue(obj);
        break;
      default:
        break;
    }
  }

  openIssueDialog(data: unknown): void {
    this.openIssue.emit(data);
  }

  openCreatedIssueDialog(id: string): void {
    this.openCreatedIssue.emit(id);
  }

  onChangeForm(): void {
    this.vacationBalanceDateUpdate.emit(this.getUnzonedISODate());
  }

  onOpenVacationImgDialog(): void {
    this.openVacationImgDialog.emit(this.getUnzonedISODate());
  }

  public formatDate(date: Date): string {
    return moment(date).format('DD.MM.YYYY');
  }

  getVacationType(typeId: string): VacationTypeInterface | undefined {
    return this.vacationTypes?.find(
      (vacation) => vacation.vacationTypeId === typeId,
    );
  }

  getVacationStatus(stateId: string): IssuesStatusListInterface | undefined {
    return this.issueStateList.states.find(
      (state: IssuesStatusListInterface) => state.id === stateId,
    );
  }

  get textVacation(): string {
    return this.vacationArray?.vacationsCount &&
      this.vacationArray.vacationsCount >= 0
      ? 'LEAVE_PLAN'
      : 'LEAVE_NOT_PLAN';
  }

  get isAdditionalText(): boolean {
    return (
      this.vacationArray?.vacationsCount &&
      this.vacationArray.vacationsCount >= 0
    );
  }

  private getUnzonedISODate(): string {
    const date = new Date(this.vacationBalanceDateForm.get('date')?.value);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    ).toISOString();
  }

  get tooltipText(): string {
    const balance = [];
    this.vacationTotal?.vacations?.forEach((bal) => {
      balance.push(`${bal.vacationName}: ${bal.vacationBalance}`);
    });
    return balance.join(' \r\n');
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(new Date(date.year, date.month, date.day));
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
