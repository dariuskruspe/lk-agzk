import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  WritableSignal,
} from '@angular/core';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';

@Component({
    selector: 'app-user-profile-app-settings-container',
    templateUrl: './user-profile-app-settings-container.component.html',
    styleUrls: ['./user-profile-app-settings-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('APP_SETTINGS', 0)],
    standalone: false
})
export class UserProfileAppSettingsContainerComponent {
  app: AppService = inject(AppService);

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.storage.settings.data.frontend.signal.userSettings;

  constructor(
    @Inject(BREADCRUMB) private _: unknown,
    public currentUser: MainCurrentUserFacade
  ) {}

  async updateUserSettings(): Promise<void> {
    await this.app.userSettingsHandler();
  }
}
