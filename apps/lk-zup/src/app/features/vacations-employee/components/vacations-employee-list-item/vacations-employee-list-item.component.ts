import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import moment from 'moment/moment';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { EmployeeInterface } from '../../models/vacations.interface';

@Component({
    selector: 'app-vacation-employee-list-item',
    templateUrl: './vacations-employee-list-item.component.html',
    styleUrls: ['./vacations-employee-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VacationsEmployeeListItemComponent {
  apiUrl = Environment.inv().api;

  @Input() item: EmployeeInterface;

  @Input() isDownloadEmployeeReportInProgress: boolean;

  @Output() downloadItem = new EventEmitter<string>();

  download(): void {
    this.downloadItem.emit(this.item.employeeID);
  }

  get vacationString(): string {
    return `${moment(this.item.vacation.vacationBegin).format(
      'DD.MM.YYYY',
    )} - ${moment(this.item.vacation.vacationEnd).format('DD.MM.YYYY')} (${
      this.item.vacation.vacationDays
    }`;
  }

  get tooltipText(): string {
    const balance = [];
    this.item.vacationsBalance?.forEach((bal) => {
      balance.push(`${bal.vacationName}: ${bal.vacationBalance}`);
    });
    return balance.join(' \r\n');
  }
}
