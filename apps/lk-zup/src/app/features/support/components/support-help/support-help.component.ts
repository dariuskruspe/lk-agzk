import { Component, Input } from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import { SupportHelpItemInterface } from '../../models/support-help.interface';

@Component({
    selector: 'app-support-help',
    templateUrl: './support-help.component.html',
    styleUrls: ['./support-help.component.scss'],
    standalone: false
})
export class SupportHelpComponent {
  @Input() currentUser: MainCurrentUserInterface;

  @Input() helpList: SupportHelpItemInterface[];

  @Input() settings: SettingsInterface;

  public isMobile = Environment.isMobileApp();

  constructor(public langUtils: LangUtils) {}
}
