import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  signal,
  Type,
  WritableSignal,
} from '@angular/core';
import {
  Action,
  ActionAlertInterface,
  AlertsInterface,
} from '@features/main/models/alerts.interface';
import { NotificationItemInterface } from '@features/main/models/notifications.interface';
import { Environment } from '@shared/classes/ennvironment/environment';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { AbstractActionComponent } from '@shared/features/unfinished-actions/components/abstract-action/abstract-action.component';
import { ConfirmationCodeComponent } from '@shared/features/unfinished-actions/components/confirmation-code/confirmation-code.component';
import { MessageComponent } from '@shared/features/unfinished-actions/components/message/message.component';
import { ConfirmBodyInterface } from '@shared/features/unfinished-actions/models/confirm.interface';
import { ActionsService } from '@shared/features/unfinished-actions/services/actions.service';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom, Observable } from 'rxjs';

// Перенесено из unfinished-actions-container.component
const COMPONENTS: Record<Action, Type<AbstractActionComponent>> = {
  signatureReleaseConfirmBySMS: ConfirmationCodeComponent,
  signingConfirmBySMS: ConfirmationCodeComponent,
  confirmByOtherApp: MessageComponent,
};

@Injectable({
  providedIn: 'root',
})
export class MainEmployeeAlertsService {
  app: AppService = inject(AppService);

  actionService: ActionsService = inject(ActionsService);

  dialogService: DialogService = inject(DialogService);

  localStorageService: LocalStorageService = inject(LocalStorageService);

  messageSnackbarService: MessageSnackbarService = inject(
    MessageSnackbarService,
  );

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  alertsSignal: WritableSignal<AlertsInterface> =
    this.currentUserStorage.data.frontend.signal.alerts;

  actionNotificationsSignal: WritableSignal<NotificationItemInterface[]> =
    signal([]);

  public alertsInterval: ReturnType<typeof setInterval>;

  /**
   * Открыт ли диалог с действием из уведомления (например, диалог с полем ввода СМС-кода для выпуска электронной подписи).
   */
  isActionOpened: boolean = false;

  /**
   * Открыта ли выпадающая панель (оверлей, "окошко") уведомлений.
   */
  isNotificationsOverlayOpened = false;

  constructor(public http: HttpClient) {}

  getAlerts(employeeID: string): Observable<AlertsInterface> {
    return this.http.get<AlertsInterface>(
      `${Environment.inv().api}/wa_employee/${employeeID}/employeeAlerts`,
    );
  }

  async alertsHandler() {
    const employeeId: string = this.localStorageService.getCurrentEmployeeId();

    const getAlerts = async () => {
      if (!employeeId) return;

      const alerts: AlertsInterface = await firstValueFrom(
        this.getAlerts(employeeId),
      );

      this.alertsSignal.set(alerts);
    };

    const handleAlerts = async () => {
      await getAlerts();
      this.showGeneralAlerts();
      this.actionsHandler();
    };

    if (this.alertsInterval) clearInterval(this.alertsInterval);
    this.alertsInterval = setInterval(async () => {
      await handleAlerts();
    }, 20000);
  }

  showGeneralAlerts(): void {
    const alerts: AlertsInterface = this.alertsSignal();
    if (!alerts) return;

    const messages: string[] = alerts.general || [];
    if (!messages.length) return;

    messages.forEach((message) => {
      this.messageSnackbarService.show(message, MessageType.warn);
    });
  }

  actionsHandler(): void {
    const alerts: AlertsInterface = this.alertsSignal();
    if (!alerts) return;

    const { actions } = alerts;
    if (!actions) return;

    // this.testActionAlert(actions);

    const actionNotifications: NotificationItemInterface[] =
      this.convertActionsToNotifications(actions ?? []);
    this.actionNotificationsSignal.set(actionNotifications);

    this.showActionsHandler(actions);
  }

  showActionsHandler(actions: ActionAlertInterface[]): void {
    if (this.isActionOpened) return;

    const actionTypesToShow: string[] = [
      'signatureReleaseConfirmBySMS', // SMS-подтверждение выпуска электронной цифровой подписи
      // 'signingConfirmBySMS', // SMS-подтверждение подписания документа при помощи ЭЦП
    ];

    const actionsToShow = actions.filter((a) =>
      actionTypesToShow.includes(a.type),
    );

    // при наличии уведомлений о незавершённых действиях автоматически показываем диалог с первым попавшимся
    // незавершённым действием (например, вводом SMS-кода)
    if (actionsToShow?.length) this.showActionDialog(actionsToShow[0]);
  }

  testActionAlert(actionAlerts: ActionAlertInterface[]) {
    const testActionAlert: ActionAlertInterface = {
      objects: [],
      pushId: '123',
      type: 'signatureReleaseConfirmBySMS' as Action,
      text: 'Text',
      title: 'Title',
    };
    actionAlerts.push(testActionAlert);
  }

  showActionDialog(action: ActionAlertInterface): void {
    const dialog = this.dialogService.open(COMPONENTS[action.type], {
      data: action,
      dismissableMask: true,
      header: action.title,
    });

    if (!dialog) return;

    this.isActionOpened = true;

    dialog.onClose.subscribe(async (body: ConfirmBodyInterface) => {
      if (body) {
        await firstValueFrom(this.actionService.sendConfirmCode(body));
        this.isActionOpened = false;
      } else {
        this.isActionOpened = false;
      }
    });
  }

  private convertActionsToNotifications(
    items: ActionAlertInterface[],
  ): NotificationItemInterface[] {
    return items.map((item, index) => {
      return {
        id: `${index}`,
        title: item.title,
        locked: true,
        message: item.text,
        icon: 'pi-clock',
        payload: item,
      };
    });
  }
}
