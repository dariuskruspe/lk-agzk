import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  Type,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { UrlSegment } from '@angular/router';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { AbstractVacationsDialogComponent } from '@features/vacations/components/abstract-vacation-dialog/abstract-vacations-dialog.component';
import { VacationsApproveDialogComponent } from '@features/vacations/components/vacations-approve-dialog/vacations-approve-dialog.component';
import { VacationsEditDialogComponent } from '@features/vacations/components/vacations-edit-dialog/vacations-edit-dialog.component';
import { VacationsInfoDialogComponent } from '@features/vacations/components/vacations-info-dialog/vacations-info-dialog.component';
import { VacationsGraphDayOffListInterface } from '@features/vacations/models/vacations-graph-day-off-list.interface';
import { VacationsGraphFilterInterface } from '@features/vacations/models/vacations-graph-filter.interface';
import { VacationsStatesInterface } from '@features/vacations/models/vacations-states.interface';
import {
  AvailableDaysReponseInterface,
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { CalendarGraphInterface } from '@shared/features/calendar-graph/models/calendar-graph.interface';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { FileBase64 } from '@shared/models/files.interface';
import {
  GetReportParamsInterface,
  ReportApiService,
} from '@shared/services/api/report-api.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import {
  beginningOfMonth,
  beginningOfYear,
  endOfMonth,
  endOfYear,
} from '@shared/utils/datetime/common';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButton } from 'primeng/splitbutton';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { MessageSnackbarService } from '@app/shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@app/shared/features/message-snackbar/models/message-type.enum';

@Component({
  selector: 'app-vacations-graph',
  templateUrl: './vacations-graph.component.html',
  styleUrls: ['./vacations-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class VacationsGraphComponent implements OnChanges {
  app = inject(AppService);

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService,
  );

  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService,
  );

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  infoDialogComponent: Type<VacationsInfoDialogComponent> =
    VacationsInfoDialogComponent;

  years: number[] = [
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  startDate: string;

  stopDate: string;

  @Input() loading$: Observable<boolean>;

  filterInputs: FpcInputsInterface[];

  filterConfig: FpcInterface;

  filterConfigFullscreen: FpcInterface;

  filterValues;

  daysOfWeek: string[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  months: string[] = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  calendarConfig: CalendarGraphInterface;

  calendarConfig$: BehaviorSubject<CalendarGraphInterface> =
    this.employeeVacationsService.calendarConfig$;

  employeesOptionList: {
    title: string;
    value: boolean;
    items: { title: string; value: string }[];
  }[] = [];

  @Input() types: WorkStatusInterface[];

  @Input() states: VacationsStatesInterface;

  @Input() availableDays: AvailableDaysReponseInterface;

  @Input() vacations: VacationsInterface[];

  @Input() currentUser: MainCurrentUserInterface;

  @Input() loading: boolean;

  @Input() dayOffList: VacationsGraphDayOffListInterface;

  @Input() initYear: number;

  @Output() modalAddEditSubmit = new EventEmitter();

  @Output() filterChanged = new EventEmitter<number>();

  @Output() openModal = new EventEmitter<{
    type: 'edit' | 'approve';
    component: Type<AbstractVacationsDialogComponent>;
    vacation: VacationsInterface;
    year: number;
  }>();

  private bufferedYear: number;

  saveReportButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => {
        this.downloadReport('xlsx');
      },
    },
    {
      label: 'pdf',
      command: () => {
        this.downloadReport('pdf');
      },
    },
  ];

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  @ViewChild('splitButton') splitButtonComponent: SplitButton;

  constructor(
    // API
    private reportApi: ReportApiService,

    // Other
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
    private translatePipe: TranslatePipe,
    private localStorageService: LocalStorageService,
    private toastService: MessageSnackbarService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initYear && changes.initYear.currentValue) {
      this.bufferedYear = this.initYear;
      this.startDate = this.getStartDate(this.initYear);
      this.stopDate = this.getEndDate(this.initYear);
      this.filterInputs = [
        {
          type: 'select',
          formControlName: 'date',
          label: this.translatePipe.transform('CHOOSE_A_YEAR'),
          gridClasses: ['col-lg-3', 'com-md-12'],
          validations: ['required'],
          edited: true,
          value: this.initYear as any,
          optionList: this.years.map((year) => ({
            title: year.toString(),
            value: year as any,
          })),
        },
        {
          type: 'select-multi',
          formControlName: 'employees',
          label: this.translatePipe.transform('EMPLOYEES'),
          gridClasses: ['col-lg-6', 'com-md-12'],
          validations: [],
          edited: true,
          selectMultiple: true,
          optionList: [],
        },
        {
          type: 'select',
          formControlName: 'showType',
          label: this.translatePipe.transform('GRAPH_VIEW'),
          gridClasses: ['col-lg-3', 'com-md-12'],
          validations: ['required'],
          edited: true,
          value: 'year',
          optionList: [
            {
              value: 'month',
              title: this.translatePipe.transform('MONTH'),
            },
            {
              value: 'year',
              title: this.translatePipe.transform('YEAR'),
            },
          ],
        },
      ];

      if (document.body.clientWidth <= 769) {
        const temp = this.filterInputs[0];
        this.filterInputs[0] = this.filterInputs[1];
        this.filterInputs[1] = temp;
        this.filterInputs.splice(2, 1);
      }
      this.filterConfig = {
        options: {
          changeStrategy: 'push',
          appearanceElements: 'outline',
          editMode: true,
          viewMode: 'edit',
          submitDebounceTime: 1000,
        },
        template: this.filterInputs,
      };
      this.calendarConfig = {
        showType: 'year',
        membersShow: true,
        date: this.startDate,
        endDate: this.stopDate,
        graphType: 'schedule',
        showWorkTime: false,
        showDaysOff: true,
        managementMode: true,
      };
      this.calendarConfig$.next(this.calendarConfig);
    }
    if (changes.vacations && changes.vacations.currentValue) {
      let employeesInput = this.filterConfig.template.find(
        (e: FpcInputsInterface) => e.formControlName === 'employees',
      );
      const membersOptionList = this.vacations.reduce(
        (acc, vacation) => {
          const updAcc = acc.map((group) => {
            if (group.value === vacation.subordinated) {
              group.items.push({
                title: vacation.name,
                value: vacation.employeeId,
              });
            }
            return group;
          });
          return updAcc;
        },
        [
          {
            title: this.translatePipe.transform('TITLE_MY_SUBORDINATES'),
            value: true,
            items: [],
          },
          {
            title: this.translatePipe.transform('TITLE_MY_COLLEGUES'),
            value: false,
            items: [],
          },
        ],
      );
      this.employeesOptionList = membersOptionList.filter(
        (value) => value.items?.length,
      );
      employeesInput = Object.assign(employeesInput, {
        optionList: this.employeesOptionList,
      });
      this.filterInputs = Object.assign(this.filterInputs, employeesInput);
      this.filterConfigFullscreen = {
        options: {
          changeStrategy: 'push',
          appearanceElements: 'outline',
          editMode: true,
          viewMode: 'edit',
          submitDebounceTime: 1000,
        },
        template: this.filterInputs
          .filter((input) => input.formControlName !== 'date')
          .map((input) => {
            return {
              ...input,
              gridClasses: ['col-lg-4', 'col-md-12'],
            };
          }),
      };
    }
  }

  onFilterSubmit(filterValues: VacationsGraphFilterInterface): void {
    const year = filterValues.date as number;
    const modValue = filterValues;
    if (this.bufferedYear !== year) {
      this.bufferedYear = year;
      this.filterChanged.emit(year);
    }
    const calendarConfig = { ...this.calendarConfig };
    modValue.date = this.getStartDate(year);
    modValue.endDate = this.getEndDate(year);

    this.calendarConfig$.next(Object.assign(calendarConfig, modValue));
  }

  onEdit(): void {
    const currentVacation = this.vacations?.find((vacation) =>
      this.currentUser.employees.find(
        (employee) => employee.employeeID === vacation.employeeId,
      ),
    );
    if (currentVacation) {
      this.openModal.emit({
        type: 'edit',
        component: VacationsEditDialogComponent,
        vacation: currentVacation,
        year: this.bufferedYear,
      });
    }
  }

  onOpenApproval(event: VacationsInterface): void {
    this.openModal.emit({
      type: 'approve',
      component: VacationsApproveDialogComponent,
      vacation: event,
      year: this.bufferedYear,
    });
  }

  onOpenEdit(data: {
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }): void {
    this.openModal.emit({
      type: 'edit',
      component: VacationsEditDialogComponent,
      vacation: data.vacation,
      year: this.bufferedYear,
    });
  }

  getStartDate(year: number): string {
    return new Date(
      year,
      0,
      1,
      -new Date().getTimezoneOffset() / 60,
      0,
      0,
    ).toISOString();
  }

  getEndDate(year: number): string {
    return new Date(
      year,
      11,
      31,
      -new Date().getTimezoneOffset() / 60,
      0,
      0,
    ).toISOString();
  }

  toggleMenu(event?: Event): void {
    // Предотвращаем стандартное поведение кнопки
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Используем requestAnimationFrame для гарантии, что DOM готов
    requestAnimationFrame(() => {
      // Сначала пробуем найти через ViewChild компонент
      if (this.splitButtonComponent) {
        // В PrimeNG SplitButton меню может быть доступно через overlay
        const overlay = (this.splitButtonComponent as any).overlay;
        if (overlay && typeof overlay.toggle === 'function') {
          overlay.toggle();
          return;
        }

        // Пробуем найти элемент через разные свойства
        const element =
          (this.splitButtonComponent as any).el?.nativeElement ||
          (this.splitButtonComponent as any).container?.nativeElement ||
          (this.splitButtonComponent as any)._element?.nativeElement ||
          (this.splitButtonComponent as any).containerEl?.nativeElement;

        if (element) {
          // Ищем все кнопки внутри SplitButton
          const allButtons = element.querySelectorAll('button');

          if (allButtons.length >= 2) {
            // Кликаем на последнюю кнопку (dropdown button)
            const dropdownButton = allButtons[
              allButtons.length - 1
            ] as HTMLElement;
            // Используем dispatchEvent для более надежного клика
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            dropdownButton.dispatchEvent(clickEvent);
            return;
          }
        }
      }

      // Fallback: ищем через DOM по тексту кнопки
      const allSplitButtons = Array.from(
        document.querySelectorAll('p-splitbutton'),
      );
      const downloadText = this.translatePipe.transform('DOWNLOAD_REPORT');

      for (const sb of allSplitButtons) {
        const buttons = sb.querySelectorAll('button');
        if (buttons.length >= 2) {
          const firstButtonText = buttons[0].textContent?.trim();
          // Проверяем, что это наш SplitButton
          if (
            firstButtonText === downloadText ||
            firstButtonText?.includes(downloadText)
          ) {
            const dropdownButton = buttons[buttons.length - 1] as HTMLElement;
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            dropdownButton.dispatchEvent(clickEvent);
            break;
          }
        }
      }
    });
  }

  async downloadReport(format: 'pdf' | 'xlsx' = 'pdf'): Promise<void> {
    const calendarConfig: CalendarGraphInterface =
      this.calendarConfig$.getValue();

    const calendarView: 'year' | 'month' = calendarConfig.showType;

    const employeeId = this.localStorageService.getCurrentEmployeeId();

    const displayedVacations: VacationsInterface[] =
      this.employeeVacationsService.displayedVacationsSignal();

    const selectedDate: Date =
      this.vacationScheduleService.selectedDateSignal();

    const dateBegin: Date =
      calendarView === 'month'
        ? beginningOfMonth(selectedDate)
        : beginningOfYear(selectedDate);

    const dateEnd: Date =
      calendarView === 'month'
        ? endOfMonth(selectedDate)
        : endOfYear(selectedDate);

    const params: GetReportParamsInterface = {
      employeeIds: displayedVacations.map((v) => v.employeeId),
      employeeId,
      dateBegin,
      dateEnd,
      reportId: 'employeesVacationsReport',
      format,
    };

    let reportFile: FileBase64;

    // загружаем отчёт с бэка
    this.isReportLoadingSignal.set(true);
    // тоаст с текстом
    this.toastService.show(
      'Отчет формируется. Это занимает некоторое время и как только отчет сформируется, он скачается в загрузки',
      MessageType.info,
      999999999,
    );
    try {
      reportFile = await firstValueFrom(this.reportApi.getReport(params));
    } catch (error) {
      // В случае ошибки закрываем все тосты
      this.messageService.clear();
      throw error;
    } finally {
      this.isReportLoadingSignal.set(false);
    }

    // Закрываем тост после успешного завершения запроса
    // Используем setTimeout, чтобы дать время тосту отобразиться перед закрытием
    setTimeout(() => {
      this.messageService.clear();
    }, 100);

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        reportFile.file64,
        reportFile.fileExtension,
      );

    // скачиваем отчёт на устройство пользователя (компьютер/планшет/смартфон и т. п.)
    await this.fileDownloader.download(safeURL, reportFile.fileName);
  }
}
