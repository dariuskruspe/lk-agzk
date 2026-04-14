import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Subscription } from 'rxjs';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { SupportHelpListFacade } from '../../facades/support-help-list.facade';
import { SupportHelpSideMenuFacade } from '../../facades/support-help-side-menu.facade';
import { SupportHelpMenuInterface } from '../../models/support-help.interface';

@Component({
    selector: 'app-support-information-container',
    templateUrl: './support-information-container.component.html',
    styleUrls: ['./support-information-container.component.scss'],
    providers: [providePreloader(ProgressBar)],
    standalone: false
})
export class SupportInformationContainerComponent implements OnInit {
  subscription: Subscription;

  public contentTitle;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public supportHelpBlockFacade: SupportHelpListFacade,
    public supportHelpSideMenuFacade: SupportHelpSideMenuFacade,
    private preloader: Preloader
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.supportHelpSideMenuFacade.loading$() ||
        this.supportHelpBlockFacade.loading$()
    );

    this.supportHelpSideMenuFacade.getSupportHelpSideMenu(
      this.activatedRoute.snapshot.params.groupId
    );
  }

  getTitleMenu(
    supportHelpMenu: SupportHelpMenuInterface[],
    pageId: string = supportHelpMenu[0].pageId
  ): string {
    const child = supportHelpMenu.find((item) => item.parentId !== null);

    return child
      ? supportHelpMenu.find(
          (supportHelpItemMenu) => supportHelpItemMenu.parentId === pageId
        ).title
      : supportHelpMenu[0].title;
  }

  changeSupportHelpBlock(pageId: string): void {
    this.router
      .navigate(
        [
          'support',
          'info',
          this.activatedRoute.snapshot.params.groupId,
          pageId ?? 'empty',
        ],
        { replaceUrl: true }
      )
      .then();
  }
}
