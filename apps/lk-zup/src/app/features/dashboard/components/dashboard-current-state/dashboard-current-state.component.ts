import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import {
  EmployeeStateListInterface,
  EmployeeStateListItemInterface,
} from '../../../employees/models/employees.interface';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import { DashboardCurrentStateInterface } from '../../models/dashboard-current-state.interface';

@Component({
    selector: 'app-dashboard-current-state',
    templateUrl: './dashboard-current-state.component.html',
    styleUrls: ['./dashboard-current-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DashboardCurrentStateComponent implements OnChanges {
  @Input() currentState: DashboardCurrentStateInterface;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() theme: string;

  @Input() employeeStateList: EmployeeStateListInterface;

  state: EmployeeStateListItemInterface;

  @Input() isEnabled: boolean | undefined;

  hasContent = false;

  constructor(public langUtils: LangUtils, public langFacade: LangFacade) {}

  ngOnChanges(): void {
    if (this.currentState && this.employeeStateList) {
      this.state = this.employeeStateList.employeesStates.find(
        (state) => state.code === this.currentState.status
      );
    }
    this.hasContent =
      !!this.currentState && !!this.currentUser && !!this.employeeStateList;
  }
}
