import {
  ChangeDetectionStrategy,
  Component,
  inject,
  WritableSignal,
} from '@angular/core';
import { MainEmployeeAlertsService } from '@features/main/services/main-employee-alerts.service';
import { NotificationItemInterface } from '../../../../../features/main/models/notifications.interface';

@Component({
    selector: 'app-unfinished-actions-container',
    templateUrl: './unfinished-actions-container.component.html',
    styleUrls: ['./unfinished-actions-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UnfinishedActionsContainerComponent {
  employeeAlertsService: MainEmployeeAlertsService = inject(
    MainEmployeeAlertsService
  );

  actionNotificationsSignal: WritableSignal<NotificationItemInterface[]> =
    this.employeeAlertsService.actionNotificationsSignal;
}
