import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EmployeeInterface } from '../../models/vacations.interface';

@Component({
    selector: 'app-vacation-employee-list',
    templateUrl: './vacations-employee-list.component.html',
    styleUrls: ['./vacations-employee-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VacationsEmployeeListComponent {
  @Input() list: EmployeeInterface[];

  @Input() isDownloadEmployeeReportInProgress: boolean;

  @Input() loading: boolean;

  @Output() downloadById = new EventEmitter<string>();

  downloadId: string;

  downloadItem(id: string): void {
    this.downloadId = id;
    this.downloadById.emit(id);
  }
}
