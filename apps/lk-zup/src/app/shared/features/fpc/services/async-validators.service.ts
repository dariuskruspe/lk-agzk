import { Injectable } from '@angular/core';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from '../../../services/local-storage.service';
import { toUnzonedDate } from '../../../utilits/to-unzoned-date.util';
import { TranslatePipe } from '../../lang/pipes/lang.pipe';
import { WorkScheduleService } from './work-schedule.service';

@Injectable()
export class AsyncValidators {
  constructor(
    private workScheduleService: WorkScheduleService,
    private localstorage: LocalStorageService,
    private translate: TranslatePipe
  ) {}

  getValidator(
    key: string
  ): (control: { value: string }, item: FpcInputsInterface) => Observable<any> {
    const employeeId = this.localstorage.getCurrentEmployeeId();
    switch (key) {
      case 'workSchedule':
        return (control: { value: string }, item: FpcInputsInterface) => {
          const takeWorkingDays = !!item.validations.find((i) => i[key]);
          if (!moment(control.value)?.isValid()) {
            return of({
              asyncError: this.translate.transform(
                `WORK_SCHEDULE_ERROR_${takeWorkingDays}`
              ),
            });
          }
          return this.workScheduleService
            .getDayOff({
              date: toUnzonedDate(control.value).toISOString(),
              currentEmployeeId: employeeId,
            })
            .pipe(
              map((result) => {
                if (
                  (result && result?.isDayOff && !takeWorkingDays) ||
                  (result && !result?.isDayOff && takeWorkingDays)
                ) {
                  return null;
                }
                return {
                  asyncError: this.translate.transform(
                    `WORK_SCHEDULE_ERROR_${takeWorkingDays}`
                  ),
                };
              }),
              catchError(() => {
                return of({
                  asyncError: this.translate.transform(
                    `WORK_SCHEDULE_ERROR_${takeWorkingDays}`
                  ),
                });
              })
            );
        };
      default:
        return null;
    }
  }
}
