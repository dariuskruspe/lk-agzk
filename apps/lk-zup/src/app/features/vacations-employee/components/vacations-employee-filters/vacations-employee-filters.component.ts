import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { VacationsEmployeeListFacade } from '@features/vacations-employee/facades/vacations-empployee-list.facade';
import { isWeekend } from "@shared/utils/datetime/common";
import { dateMeta2Date } from "@shared/utils/datetime/primeng";
import { AppService } from "@shared/services/app.service";

@Component({
    selector: 'app-vacation-employee-filters',
    templateUrl: './vacations-employee-filters.component.html',
    styleUrls: ['./vacations-employee-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VacationsEmployeeFiltersComponent {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  @Input() filterValue: any;

  @Input() vacationsEmployeeListFacade: VacationsEmployeeListFacade;

  @Output() applyFilters = new EventEmitter();

  @Output() selectedDateChange = new EventEmitter();

  protected readonly isWeekend = isWeekend;
  protected readonly dateMeta2Date = dateMeta2Date;
}
