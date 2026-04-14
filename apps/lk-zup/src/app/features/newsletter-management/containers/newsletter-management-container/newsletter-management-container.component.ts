import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideBreadcrumb } from '@features/main/utils/breadcrumb-provider.utils';
import { AppService } from '@shared/services/app.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-newsletter-management-container',
  templateUrl: './newsletter-management-container.component.html',
  styleUrls: ['./newsletter-management-container.component.scss'],
  providers: [
    providePreloader(ProgressBar),
    provideBreadcrumb('NEWSLETTER_MANAGEMENT', 0),
  ],
  standalone: false,
})
export class NewsletterManagementContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  activeTab: 'newsletters' | 'templates' = 'newsletters';

  filterValue = {
    serach: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const { queryParams } = this.route.snapshot;
    const url = this.router.url;

    if (queryParams.tab === 'templates' && !url.includes('/templates')) {
      this.activeTab = 'templates';
      this.router.navigate(['/newsletter-management/templates'], {
        queryParams: { tab: 'templates' },
      });
    } else if (url.includes('/templates')) {
      this.activeTab = 'templates';
    } else {
      this.activeTab = 'newsletters';
    }
  }

  changeTab(tabName: 'newsletters' | 'templates'): void {
    if (this.activeTab !== tabName) {
      this.activeTab = tabName;
      if (tabName === 'newsletters') {
        this.router.navigate(['/newsletter-management'], {
          queryParams: { tab: 'newsletters' },
        });
      } else {
        this.router.navigate(['/newsletter-management/templates'], {
          queryParams: { tab: 'templates' },
        });
      }
    }
  }

  onCreate(): void {
    if (this.activeTab === 'templates') {
      this.onCreateTemplate();
    } else {
      this.onCreateNewsletter();
    }
  }

  onCreateNewsletter(): void {
    this.router.navigate(['/newsletter-management/create']);
  }

  onCreateTemplate(): void {
    this.router.navigate(['/newsletter-management/templates/create']);
  }

  applySearchFilter(): void {}

  toggleFilters(data: any): void {}
}
