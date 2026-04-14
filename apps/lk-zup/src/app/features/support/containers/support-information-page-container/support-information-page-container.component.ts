import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Subscription } from 'rxjs';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SupportHelpListFacade } from '../../facades/support-help-list.facade';
import { SupportInformationPageFacade } from '../../facades/support-information-page.facade';

@Component({
    selector: 'app-support-information-page-container',
    templateUrl: './support-information-page-container.component.html',
    styleUrls: ['./support-information-page-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb(SupportInformationPageFacade, 1),
    ],
    standalone: false
})
export class SupportInformationPageContainerComponent implements OnInit {
  subscription: Subscription;

  public contentTitle;

  constructor(
    public activatedRoute: ActivatedRoute,
    public supportHelpBlockFacade: SupportHelpListFacade,
    public supportInformationPageFacade: SupportInformationPageFacade,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.activatedRoute?.url.subscribe((url) => {
      this.getSupportPageInformation(url[0].path);
    });

    this.preloader.setCondition(
      this.supportInformationPageFacade.loading$() ||
        this.supportHelpBlockFacade.loading$()
    );
  }

  getSupportPageInformation(pageId: string): void {
    this.supportInformationPageFacade.getSupportPage(pageId);
  }
}
