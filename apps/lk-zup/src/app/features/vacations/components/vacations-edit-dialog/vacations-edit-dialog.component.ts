import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { VacationActionEnum } from '@features/vacations/models/vacations-approval.interface';
import { DateClass } from '@shared/features/calendar-graph/classes/date.class';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, skip, take, takeUntil } from 'rxjs/operators';
import { VacationsGraphEditPeriodsFacade } from '../../facades/vacations-graph-edit-periods.facade';
import { AvailableVacationDaysInterface } from '../../models/vacations.interface';
import { AbstractVacationsDialogComponent } from '../abstract-vacation-dialog/abstract-vacations-dialog.component';
import { VacationsTextDialogComponent } from '../vacations-text-dialog/vacations-text-dialog.component';

@Component({
    selector: 'app-vacations-edit-dialog',
    templateUrl: './vacations-edit-dialog.component.html',
    styleUrls: ['./vacations-edit-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VacationsEditDialogComponent
  extends AbstractVacationsDialogComponent
  implements AfterViewInit, OnDestroy
{
  availableDays: AvailableVacationDaysInterface[];

  chosenType: AvailableVacationDaysInterface;

  chosenTypeId: string;

  needChangesAfterReject = false;

  everythingFilled = true;

  initialized = false;

  period14isRequired = true;

  hasChanges = false;

  saving = false;

  selectedYear: number;

  yearOptions: { label: string; value: number }[] = [];

  private readonly editPeriodsFacade: VacationsGraphEditPeriodsFacade | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: DynamicDialogRef,
    protected config: DynamicDialogConfig,
    protected dateClass: DateClass,
    protected translatePipe: TranslatePipe,
    protected snackbarService: MessageSnackbarService,
    private dialog: DialogService,
    private cdr: ChangeDetectorRef,
  ) {
    super(dialogRef, config, dateClass, translatePipe, snackbarService);

    this.editPeriodsFacade = this.config.data?.editPeriodsFacade as VacationsGraphEditPeriodsFacade | undefined;

    this.availableDays = this.data.availableDays.vacationTypes
      .map((planningType) => {
        return {
          ...planningType,
          vacationType: this.data.types.find(
            (type) => type.vacationTypeID === planningType.vacationTypeId
          ),
        };
      })
      .filter(
        (planningType) =>
          (planningType.vacationType.main ||
            planningType.vacationType.annual) &&
          planningType?.daysTotal > 0
      )
      .sort((a, b) => {
        if (a.vacationType.main) {
          return -1;
        }
        if (b.vacationType.main) {
          return 1;
        }
        return 0;
      });

    this.period14isRequired = !!this.data.availableDays.vacationTypes.filter(
      (item) => {
        return item.daysAvailable >= 14;
      }
    ).length;

    this.changedPeriods = this.periodsToTyped(this.periods);

    this.needChangesAfterReject = this.commonPeriod.approved === false;

    this.setType(this.availableDays[0]);

    this.hasCrossingPeriods = this.findCrossingPeriods();

    // Инициализация года планирования
    this.selectedYear = this.data.year;
    this.yearOptions = [
      { label: String(this.data.year), value: this.data.year }
    ];
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  setChangedPeriods(
    value: {
      vacations: {
        startDate: string;
        endDate: string;
        disabled?: boolean | '';
        typeId?: string;
      }[];
    },
    vacationTypeId: string
  ): void {
    this.needChangesAfterReject = true;

    if (this.config?.data?.vacation?.periods?.length) {
      value.vacations.forEach((vacation) => {
        const index = this.config.data.vacation.periods.findIndex((period) => {
          return (
            period.vacationTypeId === vacationTypeId &&
            this.isSamePeriod(vacation, period)
          );
        });
        if (index === -1) {
          this.needChangesAfterReject = false;
        }
      });
    } else {
      this.needChangesAfterReject = false;
    }

    this.everythingFilled = true;
    this.changedPeriods[vacationTypeId] = value.vacations.map((period) => {
      if (!period.endDate || !period.startDate) {
        this.everythingFilled = false;
      }
      const separatedDates = this.separateDates(
        this.toISOstring(period.startDate),
        this.toISOstring(period.endDate),
        this.daysOff
      );
      return {
        startDate: this.toISOstring(period.startDate),
        endDate: this.toISOstring(period.endDate),
        disabled: this.isPeriodDisabled(period),
        chosenDates: this.getStaticText(separatedDates),
        daysLength: separatedDates.total,
      };
    });
    this.forms[vacationTypeId].next({
      ...this.formData,
      data: {
        vacations: this.changedPeriods[vacationTypeId],
      },
    });
    this.recountAvailableDays(vacationTypeId);
    this.hasCrossingPeriods = this.findCrossingPeriods();
  }

  isSamePeriod(
    period1: { startDate: string; endDate: string },
    period2: { startDate: string; endDate: string }
  ) {
    return (
      toUnzonedDate(new Date(period1.startDate)).getTime() ===
        toUnzonedDate(new Date(period2.startDate)).getTime() &&
      toUnzonedDate(new Date(period1.endDate)).getTime() ===
        toUnzonedDate(new Date(period2.endDate)).getTime()
    );
  }

  onDatesChange(form: FormGroup, vacationTypeId: string): void {
    this.hasChanges = true;
    const vacations = (form.controls.vacations as FormArray).controls.map(
      (control) => control.value
    );
    this.setChangedPeriods({ vacations }, vacationTypeId);
  }

  recountAvailableDays(vacationTypeId: string): void {
    if (this.data.availableDays) {
      let is14daysPeriod = false;
      const typeIndex = this.availableDays.findIndex(
        (type) => type.vacationTypeId === vacationTypeId
      );
      const defaultIndex = this.data.availableDays.vacationTypes.findIndex(
        (type) => type.vacationTypeId === vacationTypeId
      );
      const changedDays = (this.changedPeriods[vacationTypeId] ?? [])
        .filter((period) => !this.isPeriodDisabled(period))
        .reduce(
          (acc: AvailableVacationDaysInterface, period) => {
            const diff = this.dateClass.getDateDiffWithoutHolidays(
              this.toISOstring(period.startDate),
              this.toISOstring(period.endDate),
              this.daysOff ?? {}
            );
            acc.daysPlanned += diff;
            acc.daysAvailable -= diff;
            if (diff >= 14) {
              is14daysPeriod = true;
            }
            return acc;
          },
          {
            ...this.availableDays[typeIndex],
            daysTotal:
              this.data.availableDays.vacationTypes[defaultIndex].daysTotal,
            daysPlanned: 0,
            daysAvailable:
              this.data.availableDays.vacationTypes[defaultIndex].daysAvailable,
          }
        );
      this.availableDays[typeIndex].daysPlanned = changedDays.daysPlanned;
      this.availableDays[typeIndex].daysAvailable = changedDays.daysAvailable;
      this.availableDays[typeIndex].daysTotal = changedDays.daysTotal;

      if (is14daysPeriod || !this.period14isRequired) {
        this.typesHaving14DaysPeriod.add(vacationTypeId);
      } else {
        this.typesHaving14DaysPeriod.delete(vacationTypeId);
      }

      this.invalid[vacationTypeId] =
        this.availableDays[typeIndex].daysAvailable > 0;
    }
  }

  setType(value: AvailableVacationDaysInterface): void {
    if (this.initialized) {
      this.setChangedPeriods(
        {
          vacations: this.filterUnfilled(this.chosenTypeId),
        },
        this.chosenTypeId
      );
    }

    this.chosenType = value;
    this.chosenTypeId = this.chosenType.vacationTypeId;
  }

  private filterUnfilled(
    typeId: string
  ): { startDate: string; endDate: string; disabled: boolean | '' }[] {
    return (
      this.changedPeriods[typeId]?.filter(
        (period) => period.startDate && period.endDate
      ) ?? []
    );
  }

  setInvalid(event: boolean, vacationTypeId: string): void {
    this.formInvalid[vacationTypeId] = event;
  }

  get daysSum(): { totalAvailable: number; typeAvailable: number } {
    return this.availableDays.reduce(
      (acc, type) => {
        acc.totalAvailable += type.daysAvailable;
        if (type.vacationTypeId === this.chosenTypeId) {
          acc.typeAvailable = type.daysAvailable;
        }
        return acc;
      },
      {
        totalAvailable: 0,
        typeAvailable: 0,
      }
    );
  }

  protected fillForm(): void {
    this.availableDays.forEach((type) => {
      this.recountAvailableDays(type.vacationTypeId);
      this.forms[type.vacationTypeId] = new BehaviorSubject({
        ...this.formData,
        data: {
          vacations: this.periods
            .filter((period) => period.vacationTypeId === type.vacationTypeId)
            .sort((period1, period2) => {
              return (
                +new Date(period1.startDate) - +new Date(period2.startDate)
              );
            })
            .map((period) => ({
              startDate: this.toISOstring(period.startDate),
              endDate: this.toISOstring(period.endDate),
              disabled: this.isPeriodDisabled(period),
              chosenDates: this.getStaticText(
                this.separateDates(
                  this.toISOstring(period.startDate),
                  this.toISOstring(period.endDate),
                  this.daysOff
                )
              ),
            })),
        },
      });
      this.invalid[type.vacationTypeId] = type.daysAvailable > 0;
    });
  }

  private findCrossingPeriods(): boolean {
    const datesOfYear = [];
    let hasCoincidence = false;
    // eslint-disable-next-line no-labels
    mainLoop: for (const typeKey of Object.keys(this.changedPeriods)) {
      const periods = this.changedPeriods[typeKey];
      for (const period of periods) {
        const startDayOfYear = this.dateClass.getDayOfAYear(
          this.dateClass.getUnzonedDate(period.startDate)
        );
        const endDayOfYear = this.dateClass.getDayOfAYear(
          this.dateClass.getUnzonedDate(period.endDate)
        );
        for (let i = startDayOfYear; i <= endDayOfYear; i += 1) {
          if (datesOfYear[i]) {
            hasCoincidence = true;
            // eslint-disable-next-line no-labels
            break mainLoop;
          }
          datesOfYear[i] = 1;
        }
      }
    }
    return hasCoincidence;
  }

  get possibleDays(): number {
    return this.data.availableDays.vacationTypes.find((item) => {
      return item.vacationTypeId === this.chosenTypeId;
    }).daysPossible;
  }

  get validMinMax(): boolean {
    let isValid = true;
    this.availableDays.forEach((vac) => {
      const daysPlanned = this.data.availableDays.vacationTypes.find((item) => {
        return item.vacationTypeId === vac.vacationTypeId;
      });
      isValid =
        isValid &&
        vac.daysPlanned >= daysPlanned.daysAvailable &&
        vac.daysPlanned <= daysPlanned.daysPossible;
    });
    return isValid;
  }

  saveVacations(action?: VacationActionEnum) {
    if (this.needChangesAfterReject) {
      const dialogTextRef = this.dialog.open(VacationsTextDialogComponent, {
        closable: true,
        dismissableMask: true,
        header: this.translatePipe.transform('ATTENTION'),
        data: {
          text: this.translatePipe.transform('ATTENTION_VACATIONS_TEXT'),
          buttonLabel: this.translatePipe.transform('BUTTON_CONFIRM'),
        },
      });

      dialogTextRef.onClose
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            this.executeSave(action);
          }
        });
    } else {
      this.executeSave(action);
    }
  }

  private executeSave(action?: VacationActionEnum): void {
    if (!this.editPeriodsFacade || action !== VacationActionEnum.save) {
      this.close(action);
      return;
    }

    this.submit$.next();
    const changedPeriods = this.typedToPeriods(this.changedPeriods);

    if (!this.invalidSum || changedPeriods.length === 0) {
      if (this.has14daysPeriod) {
        const periods = changedPeriods.filter(
          (period) => period.disabled !== true,
        );

        this.saving = true;

        this.editPeriodsFacade.loading$()
          .pipe(
            skip(1),
            filter((loading) => !loading),
            take(1),
            takeUntil(this.destroy$),
          )
          .subscribe(() => {
            this.saving = false;
            this.cdr.markForCheck();
            this.dialogRef.close({ saved: true, year: this.data.year });
          });

        this.editPeriodsFacade.edit({
          params: { year: this.data.year },
          periods,
        });
      } else {
        this.snackbarService.show(
          this.translatePipe.transform('ERROR_VACATION_14_DAYS'),
          MessageType.error,
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
