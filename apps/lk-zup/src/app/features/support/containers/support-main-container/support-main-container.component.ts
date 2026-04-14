import { Component, Inject, OnInit } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SupportHelpFacade } from '../../facades/support-help.facade';

@Component({
    selector: 'app-support-main-container',
    templateUrl: './support-main-container.component.html',
    styleUrls: ['./support-main-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_SUPPORT', 0),
    ],
    standalone: false
})
export class SupportMainContainerComponent implements OnInit {
  constructor(
    public currentUserFacade: MainCurrentUserFacade,
    public supportHelpFacade: SupportHelpFacade,
    public settingsFacade: SettingsFacade,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(this.supportHelpFacade.loading$());

    this.supportHelpFacade.getSupportHelpList();
  }
}
