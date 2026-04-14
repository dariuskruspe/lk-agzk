import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { UsersProfilePasswordFacade } from '../../facades/users-profile-password.facade';
import { UsersProfilePasswordInterface } from '../../models/users-profile-password.interface';

@Component({
    selector: 'app-user-profile-password-container',
    templateUrl: './user-profile-password-container.component.html',
    styleUrls: ['./user-profile-password-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('CHANGE_PASSWORD', 0)],
    standalone: false
})
export class UserProfilePasswordContainerComponent {
  constructor(
    public usersProfilePasswordFacade: UsersProfilePasswordFacade,
    readonly settingsFacade: SettingsFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  changePass(data: UsersProfilePasswordInterface): void {
    this.usersProfilePasswordFacade.changePass(data);
  }
}
