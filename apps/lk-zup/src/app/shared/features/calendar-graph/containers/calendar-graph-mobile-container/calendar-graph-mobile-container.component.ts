import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import { VacationsStatesInterface } from '@features/vacations/models/vacations-states.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { FpcFilterInterface } from '@shared/features/fpc-filter/models/fpc-filter.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { isDateRangeOverlap } from '@shared/utils/datetime/common';
import { clearSelection } from '@shared/utils/DOM/common';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-calendar-graph-mobile',
  templateUrl: './calendar-graph-mobile-container.component.html',
  styleUrls: ['./calendar-graph-mobile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
  ],
  standalone: false,
})
export class CalendarGraphMobileContainerComponent
  implements OnChanges, OnInit
{
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  @Input() isBusinessTrips: boolean = false;

  @Input() months: string[];

  @Input() vacations: VacationsInterface[];

  @Input() types: WorkStatusInterface[];

  @Input() employees: {
    title: string;
    items: { title: string; value: string }[];
  }[];

  @Input() states: VacationsStatesInterface;

  @Input() loading: boolean;

  public showLegend: boolean = true;

  @Input() set filter(value: FpcInterface) {
    this.newFilter = {
      options: value.options,
      main: [value.template[0]],
      secondary: value.template.filter((_, i) => !!i),
    };
  }

  @Input() dialogComponent: Type<unknown>;

  @Input() year: number = new Date().getFullYear();

  @Input() monthIndex: number = 0; // 0 - january, 1 - february, ..., 11 - december

  @Input() view: 'month' | 'year' = 'year';

  @Output() filterSubmit = new EventEmitter();

  @Output() openEdit = new EventEmitter<{
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }>();

  filterInputs: FpcInputsInterface[] = [
    {
      type: 'text',
      formControlName: 'search',
      label: '456',
      placeholder: '',
      gridClasses: ['col-lg-4', 'com-md-12'],
      validations: [],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },
    {
      type: 'select',
      formControlName: 'state',
      label: '123',
      gridClasses: ['col-lg-4', 'com-md-12'],
      selectMultiple: true,
      validations: [],
      edited: true,
      optionList: [],
    },
    {
      type: 'select',
      formControlName: 'days',
      label: '456',
      gridClasses: ['col-lg-4', 'com-md-12'],
      validations: [],
      edited: true,
      selectMultiple: false,
      optionList: [],
    },
  ];

  filterConfig: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: true,
      viewMode: 'edit',
      submitDebounceTime: 1000,
    },
    template: this.filterInputs,
  };

  newFilter: FpcFilterInterface;

  vacationsFullData: {
    monthName: string;
    monthNumber: number;
    vacationsList: {
      employeeName: string;
      startDate: Date;
      endDate: Date;
      daysLength: number;
      type: string;
      color: string;
      approved: null | boolean;
      fullVacation: VacationsInterface;
      period: VacationPeriodInterface;
      hasIntersection: boolean;
    }[];
  }[] = [];

  filtersValue: {
    requiringApproval: boolean;
    employees: string[];
    departmentId?: string;
  } = {
    requiringApproval: false,
    employees: [],
  };

  showIntersections = false;

  intersectionPeriods: {
    employeeName: string;
    startDate: Date;
    endDate: Date;
    daysLength: number;
    type: string;
    color: string;
    approved: null | boolean;
    fullVacation: VacationsInterface;
    period: VacationPeriodInterface;
    hasIntersection: boolean;
  }[] = [];

  intersectionMonth: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    public currentUserFacade: MainCurrentUserFacade,
    private dialog: DialogService,
    public langFacade: LangFacade,
  ) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params.year) {
      this.year = params.year;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vacations?.currentValue?.length) {
      this.setVacationsFullData();
      if (+this.year === new Date().getFullYear()) {
        setTimeout(() => {
          this.scrollToCurrentMonth();
        }, 1500);
      }
    }

    if (changes.year?.currentValue) {
      this.onFilterSubmit({ date: this.year });
    }
  }

  scrollToCurrentMonth(): void {
    document
      .getElementById(`${new Date().getMonth().toString()}mobile`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setVacationsFullData(): void {
    let filteredVacations = this.vacations;
    if (this.filtersValue.employees.length) {
      filteredVacations = filteredVacations.filter((vac) => {
        return this.filtersValue.employees.includes(vac.employeeId);
      });
    }

    if (this.filtersValue.departmentId) {
      filteredVacations = filteredVacations.filter((vac) => {
        return vac.departmentId === this.filtersValue.departmentId;
      });
    }

    if (this.filtersValue.requiringApproval === true) {
      filteredVacations = filteredVacations.filter((vac) => {
        return this.hasUnsigned(vac);
      });
    }
    this.vacationsFullData = [];
    this.months.forEach((month, index) => {
      this.vacationsFullData.push({
        monthName: month,
        monthNumber: index + 1,
        vacationsList: [],
      });
    });
    filteredVacations.forEach((vacation) => {
      vacation.periods.forEach((period) => {
        const startDateMonth = new Date(period.startDate).getMonth() + 1;
        const endDateMonth = new Date(period.endDate).getMonth() + 1;
        const monthStartIndex = this.vacationsFullData.findIndex(
          (vac) => vac.monthNumber === startDateMonth,
        );
        const type = this.types?.find((typeEl) => {
          return typeEl.id === period.typeId;
        });
        if (startDateMonth !== endDateMonth) {
          const monthEndIndex = this.vacationsFullData.findIndex(
            (vac) => vac.monthNumber === endDateMonth,
          );
          this.vacationsFullData[monthEndIndex].vacationsList.push({
            employeeName: vacation.name,
            startDate: new Date(period.startDate),
            endDate: new Date(period.endDate),
            daysLength: period.daysLength,
            type: type.label,
            color: type?.color,
            approved: period.approved,
            fullVacation: vacation,
            period,
            hasIntersection: false,
          });
        }
        this.vacationsFullData[monthStartIndex].vacationsList.push({
          employeeName: vacation.name,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
          daysLength: period.daysLength,
          type: type.label,
          color: type?.color,
          approved: period.approved,
          fullVacation: vacation,
          period,
          hasIntersection: false,
        });
      });
    });
    this.setIntersections();
  }

  setIntersections(): void {
    this.vacationsFullData.forEach((month) => {
      month.vacationsList.forEach((vacation, index) => {
        let hasIntersection = false;
        month.vacationsList.forEach((vac, indexOfVac) => {
          if (index !== indexOfVac) {
            hasIntersection =
              hasIntersection ||
              isDateRangeOverlap(
                { start: vacation.startDate, end: vacation.endDate },
                { start: vac.startDate, end: vac.endDate },
              );
          }
        });
        // eslint-disable-next-line no-param-reassign
        vacation.hasIntersection = hasIntersection;
      });
    });
  }

  get filterSize(): number {
    if (
      this.filtersValue.employees.length ||
      this.filtersValue.requiringApproval ||
      this.filtersValue.departmentId
    ) {
      return 1;
    }
    return 0;
  }

  onFilterSubmit(filterValues: Record<string, any>): void {
    const filterQuery = {
      date: +this.year,
      endDate: new Date(new Date().getFullYear(), 11, 31),
      employees: [],
      showType: 'year',
    };

    if (filterValues.date) {
      filterQuery.date = +filterValues.date;
      filterQuery.endDate = new Date(filterValues.date, 11, 31);
      this.year = filterValues.date;
    }

    if (filterValues.employees) {
      this.filtersValue.employees = filterValues.employees;
    } else {
      this.filtersValue.employees = [];
    }

    if (
      filterValues.requiringApproval === true ||
      filterValues.requiringApproval === false
    ) {
      this.filtersValue.requiringApproval = filterValues.requiringApproval;
    }

    if (filterValues.departmentId !== undefined) {
      this.filtersValue.departmentId = filterValues.departmentId;
    }

    this.setVacationsFullData();
    this.filterSubmit.emit(filterQuery);
  }

  private hasUnsigned(vacation: VacationsInterface): boolean {
    return (
      !!vacation.periods.find(
        (period) => !period.approved && period.activeApprovement,
      ) && this.currentUserFacade.getData().isManager
    );
  }

  showInfo(data: {
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }): void {
    if (
      !data.period.approved &&
      this.currentUserFacade
        .getData()
        .employees.find(
          (employee) => employee.employeeID === data.vacation.employeeId,
        )
    ) {
      this.openEdit.emit(data);
    } else {
      this.dialog.open(this.dialogComponent, {
        dismissableMask: true,
        closable: true,
        data: {
          ...data,
          states: this.states,
        },
      });
    }
  }

  isDatesIntersection(
    firstDateStart: Date,
    firstDateEnd: Date,
    secondDateStart: Date,
    secondDateEnd: Date,
  ): boolean {
    return (
      (secondDateStart >= firstDateStart && secondDateStart <= firstDateEnd) ||
      (secondDateEnd >= firstDateStart && secondDateEnd <= firstDateEnd) ||
      (firstDateStart >= secondDateStart && firstDateStart <= secondDateEnd) ||
      (firstDateEnd >= secondDateStart && firstDateEnd <= secondDateEnd)
    );
  }

  hasIntersections(
    periods: {
      employeeName: string;
      startDate: Date;
      endDate: Date;
      daysLength: number;
      type: string;
      color: string;
      approved: null | boolean;
      fullVacation: VacationsInterface;
      period: VacationPeriodInterface;
      hasIntersection: boolean;
    }[],
  ): boolean {
    return !!periods.filter((item) => item.hasIntersection).length;
  }

  openIntersections(
    periods: {
      employeeName: string;
      startDate: Date;
      endDate: Date;
      daysLength: number;
      type: string;
      color: string;
      approved: null | boolean;
      fullVacation: VacationsInterface;
      period: VacationPeriodInterface;
      hasIntersection: boolean;
    }[],
    monthNumber: number,
  ): void {
    this.intersectionMonth = monthNumber;
    this.intersectionPeriods = periods;
    this.showIntersections = true;
  }

  get legendList(): WorkStatusInterface[] {
    if (this.types && this.types.length) {
      const listAll = [...this.types].reverse().filter((type) => {
        return type.showGroup.includes('vacationSchedule');
      });
      return this.types
        ? [
            listAll[0],
            { ...listAll[0], approving: true },
            { ...listAll[0], approving: false },
            listAll[1],
          ]
        : [];
    }
    return [];
  }

  /**
   * Переключить (скрыть/показать) легенду.
   */
  toggleLegend() {
    this.showLegend = !this.showLegend;
    clearSelection();
  }
}
