import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DashboardCustomWidgetsInterface } from '@app/features/dashboard/models/dashboard-custom-widgets.interfac';
import { DashboardCustomWidgetsService } from '@app/features/dashboard/services/dashboard-custom-widgets.service';
import { Preloader } from '@app/shared/services/preloader.service';
import { DashboardCurrentStateInterface } from '@features/dashboard/models/dashboard-current-state.interface';
import {
  DashboardSettings,
  MainCurrentUserInterface,
} from '@features/main/models/main-current-user.interface';
import { UsersProfileSettingsFacade } from '@features/users/facades/user-profile-settings.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import { firstValueFrom, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-users-profile-app-settings',
    templateUrl: './users-profile-app-settings.component.html',
    styleUrls: ['./users-profile-app-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UsersProfileAppSettingsComponent implements OnInit {
  app: AppService = inject(AppService);

  destroyRef: DestroyRef = inject(DestroyRef);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  settings$: Observable<SettingsInterface> = toObservable(
    this.settingsSignal
  ).pipe(
    filter((v: SettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef)
  );

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  userSettings$: Observable<UserSettingsInterface> = toObservable(
    this.userSettingsSignal
  ).pipe(
    filter((v: UserSettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef)
  );

  customWidgetsSignal: WritableSignal<DashboardCustomWidgetsInterface[]> = signal([]);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  constructor(private userProfileSettingsFacade: UsersProfileSettingsFacade, public customWidgetsService: DashboardCustomWidgetsService,) {}

  dashboardSettingsSignal: WritableSignal<DashboardSettings[]> = signal(null);

  checked: boolean;

  @Input() currentUser: MainCurrentUserInterface;

  @Output() updateUserSettings = new EventEmitter();

  @Input() currentState: DashboardCurrentStateInterface;

  @Input() del_dashboards;

  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  private preloader = inject(Preloader);

  async ngOnInit(): Promise<void> {
    this.preloader.setCondition(this.loading$);
    await Promise.all([
      firstValueFrom(this.settings$),
      firstValueFrom(this.userSettings$),
    ]);

    const userSettings: UserSettingsInterface = this.userSettingsSignal();

    const dashboardSettings = Object.keys(userSettings.dashboard)
      .filter((name) => name.includes('dashboard'))
      .map((name) => {
        return {
          id: name,
          name: name.toUpperCase(),
          enable: userSettings.dashboard[name].enable,
          description: userSettings.dashboard[name].description,
          iconName: userSettings.dashboard[name]?.iconName,
          order: userSettings.dashboard[name].order,
          visible: userSettings.dashboard[name].visible,
        };
      });

    if (userSettings.dashboard.hasCustomWidgets) {
      const customWidgets = await firstValueFrom(this.customWidgetsService.getCustomWidgets());
      this.customWidgetsSignal.set(customWidgets);
    }

    this.dashboardSettingsSignal.set(dashboardSettings);
    this.loading.set(false);
  }

  saveSettings(): void {
    const dashboards = { dashboardSettings: [] };
    this.dashboardSettingsSignal().forEach((item) => {
      dashboards.dashboardSettings.push({
        name: item.name,
        enable: item.enable,
        order: item.order,
      });
    });
    this.userProfileSettingsFacade.add(dashboards);
    this.updateUserSettings.emit();
  }

  hasVisibleSettings(): boolean {
    let has = false;
    this.dashboardSettingsSignal().forEach((setting) => {
      if (setting.visible) {
        has = true;
      }
    });
    return has;
  }

  async saveCustomWidgets(): Promise<void> {
    const settings = [];
    this.customWidgetsSignal().forEach((widget) => {
      settings.push({
        id: widget.id,
        display: widget.display,
        order: widget.order,
      });
    });
    await firstValueFrom(this.customWidgetsService.saveCustomWidgetSettings(settings));
  }
}
