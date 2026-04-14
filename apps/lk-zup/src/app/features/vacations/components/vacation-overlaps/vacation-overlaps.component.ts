import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VacationPeriodInterface } from '@features/vacations/models/vacations.interface';
import { HOLIDAYS_RU } from '@shared/constants/datetime/holidays/RU/common';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { VacationOverlapCalendarConfigInterface } from '@shared/features/calendar-graph/models/vacation-overlap-calendar-config.interface';
import {
  VacationOverlapCalendarDayInterface,
  VacationOverlapCalendarInterface,
  VacationOverlapPeriodInterface,
} from '@shared/features/calendar-graph/models/vacation-overlap-calendar.interface';
import { VacationsDataInterface } from '@shared/features/calendar-graph/models/vacations-data.interface';
import { LangModule } from '@shared/features/lang/lang.module';
import { HolidayInterface } from '@shared/interfaces/datetime/holidays/holidays.interface';
import { AppService } from '@shared/services/app.service';
import { logDebug } from '@shared/utilits/logger';
import {
  daysInMonth,
  getFirstDaysOfMonthsInRange,
  isDateInRange,
  isDateRangeOverlap,
  isHoliday,
  isLeapYear,
  isWeekend,
} from '@shared/utils/datetime/common';
import { capitalizeFirstLetter } from '@shared/utils/string/common';
import { TranslatePipe } from '@wafpc/base/pipes/lang.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

interface DayBuilderArgsInterface {
  // Календарь пересечений отпусков сотрудника с отпусками выбранного (кнопкой "Пересечения") сотрудника в графике отпусков.
  employeeCalendar: VacationOverlapCalendarInterface;

  // Дата, соответствующая первому дню месяца, в который входит текущий день.
  firstDayOfMonth: Date;

  // Номер дня в месяце.
  dayNumber: number;

  // Период отпуска, пересекающийся (или совпадающий) с выбранным периодом отпусков указанного сотрудника.
  overlapPeriod: VacationOverlapPeriodInterface;

  // Диапазон дат периода отпуска, пересекающегося (или совпадающего) с выбранным периодом отпусков указанного сотрудника.
  overlapPeriodRange: { start: Date; end: Date };
}

@Component({
    selector: 'app-vacation-overlaps',
    imports: [CommonModule, LangModule, DropdownModule, ReactiveFormsModule],
    templateUrl: './vacation-overlaps.component.html',
    styleUrl: './vacation-overlaps.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VacationOverlapsComponent implements OnInit {
  app = inject(AppService);

  translatePipe = inject(TranslatePipe);

  settingsStorage = this.app.storage.settings;

  langTagSignal = this.settingsStorage.data.frontend.signal.langTag;

  /**
   * Конфигурация динамически созданного диалогового окна PrimeNG с текущим компонентом в качестве содержимого.
   */
  dialogConfig = inject(DynamicDialogConfig);

  /**
   * UUID выбранного сотрудника.
   */
  selectedEmployeeId: string;

  /**
   * Данные отпусков выбранного сотрудника.
   */
  selectedEmployeeVacationsData: VacationsDataInterface;

  /**
   * Данные отпусков сотрудников со страницы "График отпусков".
   */
  allEmployeesVacationsData: VacationsDataInterface[] = [];

  /**
   * Данные пересечений отпусков сотрудников с отпусками выбранного сотрудника.
   */
  vacationOverlaps: VacationsDataInterface[];

  /**
   * Периоды отпусков выбранного сотрудника, пересекающиеся с отпусками других сотрудников.
   */
  selectedEmployeeOverlapPeriods: VacationPeriodInterface[];

  /**
   * Календарь пересечений отпусков сотрудников.
   */
  overlapCalendar: VacationOverlapCalendarInterface[] = [];

  /**
   * Рабочие статусы сотрудников.
   */
  workStatuses: WorkStatusInterface[] = [];

  /**
   * Форма пересечений отпусков сотрудников (содержит элементы управления, доступные пользователю в диалоге "Пересечения" графика отпусков).
   */
  vacationOverlapsFG: FormGroup = new FormGroup({
    period: new FormControl('', Validators.required),
  });

  /**
   * Конфигурация календаря пересечений отпусков сотрудников.
   */
  overlapCalendarConfig: VacationOverlapCalendarConfigInterface = {
    dayWidthPx: 34, // default: 34
    dayHeightPx: 56, // default: 56
  };

  ngOnInit(): void {
    this.initVacationOverlapsRelatedData();
    this.initControls();
    this.initOverlapCalendar();
  }

  /**
   * Инициализируем данные, касающиеся пересечений отпусков сотрудников с отпусками выбранного сотрудника.
   */
  initVacationOverlapsRelatedData(): void {
    // Данные отпусков сотрудников
    this.initVacationsData();

    // Рабочие статусы сотрудников
    this.initWorkStatuses();

    // UUID выбранного сотрудника
    this.initSelectedEmployeeId();

    // Данные отпусков выбранного сотрудника
    this.initSelectedEmployeeVacationsData();

    // Данные пересечений отпусков сотрудников с отпусками выбранного сотрудника
    this.initVacationOverlaps();

    // Периоды отпусков выбранного сотрудника, пересекающиеся с отпусками других сотрудников
    this.initSelectedEmployeeOverlapPeriods();
  }

  /**
   * Инициализируем данные отпусков сотрудников.
   */
  private initVacationsData(): void {
    if (this.dialogConfig?.data?.vacationsData) {
      this.allEmployeesVacationsData = structuredClone(
        this.dialogConfig?.data?.vacationsData
      );
    }
  }

  /**
   * Инициализируем рабочие статусы сотрудников.
   */
  private initWorkStatuses(): void {
    if (this.dialogConfig?.data?.workStatuses) {
      this.workStatuses = structuredClone(
        this.dialogConfig?.data?.workStatuses
      );
    }
  }

  /**
   * Инициализируем UUID выбранного сотрудника.
   */
  private initSelectedEmployeeId(): void {
    this.selectedEmployeeId = this.dialogConfig?.data?.selectedEmployeeId;
  }

  /**
   * Инициализируем данные отпусков выбранного сотрудника.
   */
  private initSelectedEmployeeVacationsData(): void {
    if (this.selectedEmployeeId) {
      this.selectedEmployeeVacationsData = this.allEmployeesVacationsData.find(
        (v) => v.employeeId === this.selectedEmployeeId
      );
    }
  }

  /**
   * Инициализируем данные пересечений отпусков сотрудников с отпусками выбранного сотрудника.
   */
  private initVacationOverlaps() {
    this.vacationOverlaps = this.allEmployeesVacationsData
      .filter((v) => v.hasIntersection)
      .map((o) => {
        // Отсеиваем пустые массивы периодов отпусков очередного сотрудника
        o.vacations = o.vacations.filter(
          (vacationPeriods) => vacationPeriods.length
        );

        // проходим по всем периодам отпусков очередного сотрудника
        for (const period of o.fullVacation.periods) {
          // дата начала очередного периода отпуска сотрудника
          const startDate: Date = new Date(period.startDate);

          // дата окончания очередного периода отпуска сотрудника
          const endDate: Date = new Date(period.endDate);

          // опции формата отображения даты начала и окончания выбранного периода отпуска сотрудника
          const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            month: '2-digit',
            day: 'numeric',
          };

          // средство форматирования ("форматировщик") даты начала и окончания выбранного периода отпуска сотрудника
          const dateFormatter = new Intl.DateTimeFormat(
            this.langTagSignal(),
            dateTimeFormatOptions
          );

          // строка, содержащая дату начала выбранного периода отпуска сотрудника в указанном формате
          const startDateString: string = dateFormatter.format(startDate);

          // строка, содержащая дату окончания выбранного периода отпуска сотрудника в указанном формате
          const endDateString: string = dateFormatter.format(endDate);

          /* для каждого периода отпуска получаем соответствующий ему рабочий статус сотрудника (например: "отпуск по графику") */

          // рабочий статус сотрудника, соответствующий очередному периоду отпуска (например: "отпуск по графику")
          const workStatus = this.workStatuses.find(
            (wStatus) => wStatus.id === period.typeId
          );

          // устанавливаем метку для каждого элемента выпадающего списка "Отпуск" с выбором периода отпуска
          period.label = `${
            workStatus?.label || this.translatePipe.transform('VACATION')
          } ${startDateString} - ${endDateString}`;
        }

        // сортируем периоды отпусков очередного сотрудника по дате начала периода (от самой ранней к самой поздней)
        o.fullVacation.periods.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        return o;
      });

    // индекс объекта, содержащего данные пересечений отпусков по выбранному сотруднику, в массиве данных пересечений отпусков сотрудников
    const selectedEmployeeVacationOverlapsDataIndex: number =
      this.vacationOverlaps.findIndex(
        (o) => o.employeeId === this.selectedEmployeeId
      );

    // перемещаем данные пересечений отпусков по выбранному сотруднику в начало массива для удобства отображения в шаблоне
    moveItemInArray(
      this.vacationOverlaps,
      selectedEmployeeVacationOverlapsDataIndex,
      0
    );
    logDebug(`vacation overlaps:`, this.vacationOverlaps);
  }

  /**
   * Инициализируем данные периодов отпусков выбранного сотрудника, пересекающихся с отпусками других сотрудников.
   */
  private initSelectedEmployeeOverlapPeriods(): void {
    const otherEmployeePeriods: VacationPeriodInterface[][] =
      this.vacationOverlaps
        .filter((o) => o.employeeId !== this.selectedEmployeeId)
        .map((o) => o.fullVacation.periods);

    this.selectedEmployeeOverlapPeriods =
      this.selectedEmployeeVacationsData.fullVacation.periods.filter((p) => {
        const startDate: Date = new Date(p.startDate);
        const endDate: Date = new Date(p.endDate);

        return otherEmployeePeriods.some((periods) =>
          periods.some((period) => {
            const start: Date = new Date(period.startDate);
            const end: Date = new Date(period.endDate);

            const isOverlap: boolean = isDateRangeOverlap(
              { start: startDate, end: endDate },
              { start, end }
            );

            return isOverlap;
          })
        );
      });
  }

  /**
   * Инициализируем элементы управления, доступные пользователю в диалоге "Пересечения" графика отпусков.
   */
  private initControls(): void {
    this.initSelectedPeriod();
  }

  /**
   * Инициализируем первоначальное значение, используемое в качестве выбранного периода отпуска сотрудника.
   */
  private initSelectedPeriod(): void {
    const selectedPeriod: VacationPeriodInterface =
      this.selectedEmployeeOverlapPeriods?.[0];
    if (!selectedPeriod) return;
    this.vacationOverlapsFG.get('period').setValue(selectedPeriod);
  }

  /**
   * Инициализируем календарь пересечений отпусков сотрудников.
   */
  private initOverlapCalendar(): void {
    // Выбранный период отпуска указанного сотрудника.
    const selectedPeriod: VacationPeriodInterface =
      this.vacationOverlapsFG.get('period').value;
    logDebug(`selectedPeriod:`, selectedPeriod);
    if (!selectedPeriod) return;

    // Дата начала выбранного периода отпуска указанного сотрудника.
    const startDate: Date = new Date(selectedPeriod.startDate);

    // Дата окончания выбранного периода отпуска указанного сотрудника.
    const endDate: Date = new Date(selectedPeriod.endDate);

    // Год, соответствующий дате начала выбранного периода отпуска указанного сотрудника.
    const startDateYear: number = startDate.getFullYear();

    // Год, соответствующий дате окончания выбранного периода отпуска указанного сотрудника.
    const endDateYear: number = endDate.getFullYear();

    // Индекс месяца, соответствующего дате начала выбранного периода отпуска указанного сотрудника (0 - январь, 1 - февраль, ..., 11 - декабрь).
    const startDateMonthIndex: number = startDate.getMonth();

    // Индекс месяца, соответствующего дате окончания выбранного периода отпуска указанного сотрудника (0 - январь, 1 - февраль, ..., 11 - декабрь).
    const endDateMonthIndex: number = endDate.getMonth();

    // Количество годов, входящих в выбранный период отпуска указанного сотрудника (обычно неполных, но всякое бывает... ^_^).
    const yearsCount: number = endDateYear - startDateYear + 1;

    // Массив, содержащий года, входящие в выбранный период отпуска указанного сотрудника.
    const selectedPeriodYears: number[] = Array.from(
      Array(yearsCount),
      (v, i) => startDateYear + i
    );

    // Число месяцев, входящих в выбранный период отпуска указанного сотрудника (как полных, так и не очень ^_^).
    const monthCount: number =
      endDateMonthIndex -
      startDateMonthIndex +
      12 * (endDateYear - startDateYear) +
      1;

    // Массив, содержащий индексы месяцев, входящих в выбранный период отпуска указанного сотрудника (0 - январь, 1 - февраль, ... 11 - декабрь).
    const selectedPeriodMonthIndexes: number[] = Array.from(
      Array(monthCount),
      (v, i) => (startDateMonthIndex + i) % 12
    );

    // Массив, содержащий даты, соответствующие первым дням тех месяцев, которые встречаются в выбранном периоде отпуска указанного сотрудника.
    const firstDaysOfMonths = getFirstDaysOfMonthsInRange({
      start: startDate,
      end: endDate,
    });

    logDebug(`firstDaysOfMonths:`, firstDaysOfMonths);

    // Опции формата отображения названия месяца.
    const monthFormatOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
    };

    // Средство форматирования ("форматировщик") даты для её преобразования в название месяца.
    const monthFormatter = new Intl.DateTimeFormat(
      this.langTagSignal(),
      monthFormatOptions
    );

    // Опции формата отображения для названия дня недели.
    const weekdayFormatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
    };

    // Средство форматирования ("форматировщик") даты для её преобразования в название дня недели.
    const weekdayFormatter = new Intl.DateTimeFormat(
      this.langTagSignal(),
      weekdayFormatOptions
    );

    // Массив, содержащий номера дней месяца, соответствующего дате начала периода отпуска.
    const startDateMonthDayNumbers = Array.from(
      Array(
        daysInMonth(
          startDateMonthIndex,
          startDateMonthIndex === 1
            ? isLeapYear(startDate.getFullYear())
            : false
        )
      ),
      (v, i) => i + 1
    );

    // Вспомогательная функция для построения объекта, содержащего данные для отображения дня месяца в календаре
    const dayBuilder = (
      args: DayBuilderArgsInterface
    ): VacationOverlapCalendarDayInterface => {
      if (!args) return;

      const {
        employeeCalendar,
        firstDayOfMonth,
        dayNumber,
        overlapPeriod,
        overlapPeriodRange,
      } = args;

      // Дата, соответствующая дню месяца.
      const date: Date = new Date(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth(),
        dayNumber
      );

      // Является ли данный день отпуском (или его частью) для сотрудника.
      const isVacation: boolean = isDateInRange(date, {
        start: overlapPeriodRange.start,
        end: overlapPeriodRange.end,
      });

      // Пересекается ли данный день в календаре пересечений отпусков сотрудника с отпусками выбранного сотрудника за указанный период.
      const isVacationOverlap: boolean =
        employeeCalendar.employeeId !== this.selectedEmployeeId &&
        isVacation &&
        isDateInRange(date, {
          start: startDate,
          end: endDate,
        });

      // Рабочий статус сотрудника, соответствующий пересекающемуся периоду
      const workStatus: WorkStatusInterface = this.workStatuses.find(
        (wStatus) => wStatus.id === overlapPeriod.typeId
      );

      // Объект, содержащий данные для отображения дня месяца в календаре.
      const day: VacationOverlapCalendarDayInterface = {
        date,
        number: dayNumber,
        shortName: capitalizeFirstLetter(weekdayFormatter.format(date)),
        isVacation,
        isCustomVacation:
          isVacation &&
          overlapPeriod.typeId === '2a01f5e1-9841-11eb-9d20-0c9d92cc44e2', // Отпуск (вне графика)
        isVacationOverlap,
        isWeekend: isWeekend(date),
        isHolidayRU: isHoliday(date),
        workStatus,
        holidayRUName:
          HOLIDAYS_RU.find(
            (holiday: HolidayInterface) =>
              holiday.day === dayNumber && holiday.month === date.getMonth()
          )?.name || '',
      };

      return day;
    };

    // преобразуем данные пересечений отпусков в структуру, подходящую для отображения в виде календаря пересечений отпусков по каждому сотруднику за выбранный период
    this.overlapCalendar = this.vacationOverlaps.map((o) => {
      // Календарь пересекающихся отпусков очередного сотрудника за выбранный период.
      const employeeCalendar: VacationOverlapCalendarInterface = {};
      employeeCalendar.employeeId = o.employeeId;
      employeeCalendar.employeeFullName = o.name;

      // Периоды отпусков очередного сотрудника, пересекающиеся с выбранным периодом отпусков указанного сотрудника.
      employeeCalendar.matchedPeriods = (
        employeeCalendar.employeeId === this.selectedEmployeeId
          ? [selectedPeriod]
          : o.fullVacation.periods.filter((p) =>
              isDateRangeOverlap(
                { start: startDate, end: endDate },
                { start: new Date(p.startDate), end: new Date(p.endDate) }
              )
            )
      ).map((p) => {
        // Период, пересекающийся (или совпадающий) с выбранным периодом отпусков указанного сотрудника.
        const overlapPeriod: VacationOverlapPeriodInterface = p;

        // Дата начала пересекающегося (или совпадающего) периода отпуска сотрудника с выбранным периодом отпусков указанного сотрудника.
        const overlapPeriodStartDate: Date = new Date(overlapPeriod.startDate);

        // Дата окончания пересекающегося (или совпадающего) периода отпуска сотрудника с выбранным периодом отпусков указанного сотрудника.
        const overlapPeriodEndDate: Date = new Date(overlapPeriod.endDate);

        // Массив, содержащий календари пересечений отпусков сотрудника на каждый месяц, входящий в выбранный период отпуска указанного сотрудника.
        overlapPeriod.matchedMonths = firstDaysOfMonths.map(
          (firstDayOfMonth: Date) => {
            // Календарь на месяц.
            const monthCalendar = {
              name: capitalizeFirstLetter(
                monthFormatter.format(firstDayOfMonth)
              ),
              days: startDateMonthDayNumbers.map((dayNumber: number) =>
                dayBuilder({
                  firstDayOfMonth,
                  employeeCalendar,
                  dayNumber,
                  overlapPeriod,
                  overlapPeriodRange: {
                    start: overlapPeriodStartDate,
                    end: overlapPeriodEndDate,
                  },
                })
              ),
              year: startDate.getFullYear(),
            };
            return monthCalendar;
          }
        );

        return overlapPeriod;
      });

      return employeeCalendar;
    });
  }

  /**
   * Обработчик событий, возникающих при изменении значений элементов управления в форме пересечений отпусков.
   *
   * @param formControlName название элемента управления в форме пересечений отпусков
   * @param event (необязательный параметр) событие, возникшее (произошедшее) при изменении значения элемента управления
   */
  onFormControlChange(formControlName: string, event: any = null): void {
    logDebug(
      '[vacation-overlaps.component.ts]: onFormControlChange -> event:',
      event
    );
    if (formControlName === 'period') this.initOverlapCalendar();
  }
}
