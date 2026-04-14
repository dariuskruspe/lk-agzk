import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { logError } from '@shared/utilits/logger';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { DeviceService } from '../../../services/device.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ModalQueueService } from '../../../services/modal-queue.service';
import { PushWebAdapter } from '../adapters/push-web.adapter';
import { PushesAllowHintDialogComponent } from '../components/pushes-allow-hint-dialog/pushes-allow-hint-dialog.component';
import { PushesEnableDialogComponent } from '../components/pushes-enable-dialog/pushes-enable-dialog.component';
import { PushSettingsService } from './push-settings.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';

const SHOW_PUSH_DIALOG_AFTER = 86400 * 3 * 1000; // 3 дня

@Injectable()
export class PushesService {
  globalSettingsState = inject(GlobalSettingsStateService);

  // на будущее, делать для мобилки пуши тож

  private pushesEnabled = new BehaviorSubject(false);

  readonly pushesEnabled$ = this.pushesEnabled.asObservable();

  readonly pushesEnabledSignal = toSignal(this.pushesEnabled);

  private pushesLoading = new BehaviorSubject(false);

  readonly pushesLoadingSignal = toSignal(this.pushesLoading);

  readonly pushesLoading$ = this.pushesLoading.asObservable();

  private subscribed = false;

  isAvailableSignal = computed(() => {
    return (
      (this.globalSettingsState.state()?.general?.pushNotificationsEnabled ||
        false) &&
      !!Environment.inv().webPushPublicKey &&
      this.deviceService.canUsePushes
    );
  });

  // показывать ли окно с предложением включить пуши
  showPushesWelcomeDialog = computed(() => {
    return (
      this.globalSettingsState.state()?.general?.pushNotificationsEnabled ||
      false
    );
  });

  constructor(
    private adapter: PushWebAdapter,
    private pushSettingsService: PushSettingsService,
    private dialogService: DialogService,
    private deviceService: DeviceService,
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private modalQueueService: ModalQueueService,
  ) {}

  async init(): Promise<void> {
    const settings = this.pushSettingsService.get();

    const isEnabled = await this.checkPushesEnabled();

    if (isEnabled) {
      return this.enable();
    }

    // пользователь не хочет пуши
    if (settings.isNeverShow) {
      return;
    }

    if (
      settings.declinedAt &&
      Date.now() - settings.declinedAt < SHOW_PUSH_DIALOG_AFTER
    ) {
      return;
    }

    await this.enable();
  }

  private async checkPushesEnabled() {
    try {
      const { subscribed } = await this.http
        .get<{ subscribed: boolean }>(this.getSubscriptionEndpoint())
        .toPromise();
      this.subscribed = subscribed ?? false;
      return this.subscribed;
    } catch (e) {
      return false;
    }
  }

  async enable(forceDialog = false) {
    this.pushesLoading.next(true);
    const permissions = await this.adapter.getPermissions();

    // если denied то показать инструкцию как включить обратно
    if (permissions === 'denied') {
      this.showAllowHintDialog();
    }
    if (permissions === 'default') {
      // если denied то показать инструкцию как включить обратно
      if (this.showPushesWelcomeDialog() !== false || forceDialog) {
        this.showEnableDialog();
      }
    } else if (permissions === 'granted') {
      try {
        await this.tapSubscription();
      } catch (e) {
        logError(e);
        this.pushesLoading.next(false);
      }
    }
  }

  async disable() {
    this.pushesLoading.next(true);
    if (this.subscribed) {
      await this.http.delete(this.getSubscriptionEndpoint()).toPromise();
    }
    await this.pushSettingsService.setNeverShowMore();
    this.pushesEnabled.next(false);
    this.pushesLoading.next(false);
  }

  private showAllowHintDialog() {
    this.modalQueueService.showWhenFree('pushes-hint', (done) => {
      this.dialogService
        .open(PushesAllowHintDialogComponent, {
          data: {},
          closable: false,
          baseZIndex: 2001, // выше notifications overlay
        })
        .onClose.subscribe(done);
    });

    this.pushesLoading.next(false);
  }

  private showEnableDialog() {
    this.modalQueueService.showWhenFree('pushes-main', (done) => {
      this.dialogService
        .open(PushesEnableDialogComponent, {
          width: '704px',
          data: {},
          baseZIndex: 2001, // выше notifications overlay
        })
        .onClose.subscribe(async (result) => {
          done();
          try {
            if (result === 'ok') {
              await this.setupPushes();
            } else if (result === 'never-show') {
              await this.pushSettingsService.setNeverShowMore();
            } else if (result === 'declined') {
              await this.pushSettingsService.setDeclinedAt(new Date());
            }
          } catch (e) {
            logError(e, 'error pushes dialog');
          } finally {
            this.pushesLoading.next(false);
          }
        });
    });
  }

  private async setupPushes() {
    try {
      await this.adapter.requestPermissions();
      await this.tapSubscription();
    } catch (e) {
      if (e?.message === 'NotGrantedPushPermissionError') {
        this.showAllowHintDialog();
      } else {
        // eslint-disable-next-line no-console
        logError(e, 'error pushes setup');
      }
      this.pushesLoading.next(false);
    }
  }

  private async tapSubscription() {
    const subscription = await this.adapter.getPushSubscription();
    await this.submitPushSubscription(subscription);
    this.pushesEnabled.next(true);
    this.pushesLoading.next(false);
  }

  private submitPushSubscription(sub: any) {
    return this.http
      .post(this.getSubscriptionEndpoint(), {
        deviceType: this.adapter.type,
        subscription: sub,
        platform: this.adapter.type,
      })
      .toPromise();
  }

  private getSubscriptionEndpoint() {
    return `${
      Environment.inv().api
    }/wa_employee/${this.localStorage.getCurrentEmployeeId()}/notifications/subscription/${
      this.deviceService.id
    }`;
  }
}
