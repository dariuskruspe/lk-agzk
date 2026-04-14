import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  WritableSignal,
} from '@angular/core';
import { UrlSegment } from '@angular/router';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { MainCurrentUserInterface } from '../../../../../features/main/models/main-current-user.interface';
import { VacationsInterface } from '../../../../../features/vacations/models/vacations.interface';
import { CalendarGraphInterface } from '../../models/calendar-graph.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-member-list',
    templateUrl: './calendar-graph-member-list.component.html',
    styleUrls: ['./calendar-graph-member-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CalendarGraphMemberListComponent {
  app = inject(AppService);

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService,
  );

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  selectedEmployeeIdsSignal: WritableSignal<string[]> =
    this.employeeVacationsService.selectedEmployeeIdsSignal;

  cd = inject(ChangeDetectorRef);

  @Input() vacations: VacationsInterface[];

  @Input() currentUser: MainCurrentUserInterface;

  @Input() calendarConfig: CalendarGraphInterface;

  @Input() trips = false;

  @Output() editVacation = new EventEmitter<VacationsInterface>();

  displayedVacationsSignal: WritableSignal<VacationsInterface[]> =
    this.employeeVacationsService.displayedVacationsSignal;

  enableEmployeeSelectionSignal: WritableSignal<boolean> =
    this.employeeVacationsService.enableEmployeeSelectionSignal;

  urlSegmentsSignal: WritableSignal<UrlSegment[]> =
    this.currentPageStorage.data.frontend.signal.urlSegments;

  constructor() {
    effect(() => {
      this.selectedEmployeeIdsSignal();
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    });
  }

  onEditVacation(vacation: VacationsInterface): void {
    this.editVacation.emit(vacation);
  }

  hasUnsigned(vacation: VacationsInterface): boolean {
    return (
      !!vacation.periods.find(
        (period) => !period.approved && period.activeApprovement,
      ) && vacation.subordinated
    );
  }
}
