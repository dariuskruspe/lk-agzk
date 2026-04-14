import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';

@Component({
    selector: 'app-user-profile-magic-link-container',
    templateUrl: './user-profile-magic-link-container.component.html',
    styleUrls: ['./user-profile-magic-link-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('AUTH_WAYS', 0)],
    standalone: false
})
export class UserProfileMagicLinkContainerComponent {
  constructor(
    public localstorageService: LocalStorageService,
    readonly settingsFacade: SettingsFacade,
    readonly currentUserFacade: MainCurrentUserFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {}
}
