import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NewsletterService } from '../../services/newsletter.service';
import {
  NewsletterInterface,
  NewsletterFilterParamsInterface,
} from '../../models/newsletter.interface';
import { AppService } from '@shared/services/app.service';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import {
  NEWSLETTER_DATA_CONFIG,
  NEWSLETTER_ITEM_LAYOUT,
} from '../../constants/newsletter-data-config';
import { FilterParamsInterface } from '@app/shared/models/filter-params.interface';

@Component({
  selector: 'app-newsletter-list-container',
  templateUrl: './newsletter-list-container.component.html',
  styleUrls: ['./newsletter-list-container.component.scss'],
  standalone: false,
})
export class NewsletterListContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  newsletters: NewsletterInterface[] = [];
  totalCount = 0;
  currentPage = 1;
  itemsPerPage = 15;

  statusList: {id: string; name: string; color: string, status: string}[] = [];

  filterParams: FilterParamsInterface = {
    useSkip: true,
    count: this.itemsPerPage,
    page: 1,
  };

  searchText = '';

  dataTemplate = NEWSLETTER_ITEM_LAYOUT;
  dataConfig: ItemListBuilderInterface[] = [...NEWSLETTER_DATA_CONFIG];

  constructor(
    private newsletterService: NewsletterService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const { queryParams } = this.route.snapshot;
    
    this.filterParams = {
      useSkip: true,
      count: queryParams.count ? +queryParams.count : this.itemsPerPage,
      page: queryParams.page ? +queryParams.page : 1,
    };
    
    if (queryParams.search) {
      this.searchText = decodeURI(queryParams.search);
    }
    
    this.currentPage = +this.filterParams.page;
    this.loadNewsletters(this.filterParams);
  }

  onLoadList(param: FilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.loadNewsletters(param).then(() => {});
    }
  }

  async loadNewsletters(param: FilterParamsInterface): Promise<void> {
    this.loading$.next(true);
    try {
      const params: NewsletterFilterParamsInterface = {
        ...this.filterParams,
        ...param,
      };

      if (this.searchText) {
        params.search = this.searchText;
      }

      const result = await firstValueFrom(
        this.newsletterService.getNewsletters(params),
      );
      this.newsletters = result.newsletterList.map(item => ({
        ...item,
        icon: 'pi pi-share-alt',
        state: item.status,
      }));
      this.createstatusList();
      this.totalCount = result.count;
    } catch (error) {
      console.error('Error loading newsletters:', error);
    } finally {
      this.loading$.next(false);
    }
  }

  createstatusList() {
    this.statusList = [];
    this.newsletters.forEach(item => {
      if (!this.statusList.find(status => status.id === item.status)) {
        this.statusList.push({
          id: item.status,
          name: item.status,
          color: item.statusColor || 'draft',
          status: item.status,
        });
      }
    });
  }

  onViewNewsletter(id: string): void {
    this.router.navigate(['/newsletter-management/view', id]);
  }

  onNewsletterClick(newsletter: NewsletterInterface): void {
    this.onViewNewsletter(newsletter.newsletterId);
  }
}
