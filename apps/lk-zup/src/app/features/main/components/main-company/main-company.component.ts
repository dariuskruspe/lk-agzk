import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import {
  Employees,
  MainCurrentUserInterface,
} from '../../models/main-current-user.interface';

@Component({
    selector: 'app-main-company',
    templateUrl: './main-company.component.html',
    styleUrls: ['./main-company.component.scss'],
    standalone: false
})
export class MainCompanyComponent implements OnChanges {
  @Output() changeEmployee = new EventEmitter<string>();

  @Input() currentUser: MainCurrentUserInterface;

  @Input() employeeId: string;

  @Input() employeeActiveName?: string;

  @Input() settings: SettingsInterface;

  selectedEmployee: Employees;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeeId) {
      this.selectedEmployee = this.currentUser?.employees.find(
        (item) => item.employeeID === this.employeeId
      );
    }
  }

  onCheckedEmployee(employee: Employees): void {
    this.changeEmployee.emit(employee.employeeID);
  }

  onChangeSelectedEmployeeId(employeeId: string): void {
    this.changeEmployee.emit(employeeId);
  }

  get selectedEmployeeId() {
    return this.employeeId || this.currentUser.employees[0]?.employeeID;
  }

  trackBy(index: number, employee: Employees) {
    return employee.employeeID;
  }
}
