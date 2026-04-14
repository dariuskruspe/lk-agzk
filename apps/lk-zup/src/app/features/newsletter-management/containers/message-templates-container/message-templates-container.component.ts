import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MessageTemplateService } from '../../services/message-template.service';
import {
  MessageTemplateInterface,
  MessageTemplateFilterParamsInterface,
} from '../../models/message-template.interface';
import { AppService } from '@shared/services/app.service';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import {
  MESSAGE_TEMPLATE_DATA_CONFIG,
  MESSAGE_TEMPLATE_ITEM_LAYOUT,
} from '../../constants/message-template-data-config';
import { FilterParamsInterface } from '@app/shared/models/filter-params.interface';

@Component({
  selector: 'app-message-templates-container',
  templateUrl: './message-templates-container.component.html',
  styleUrls: ['./message-templates-container.component.scss'],
  standalone: false,
})
export class MessageTemplatesContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  templates: MessageTemplateInterface[] = [];
  totalCount = 0;
  currentPage = 1;
  itemsPerPage = 15;

  filterParams: FilterParamsInterface = {
    useSkip: true,
    count: this.itemsPerPage,
    page: 1,
  };

  searchText = '';

  dataTemplate = MESSAGE_TEMPLATE_ITEM_LAYOUT;
  dataConfig: ItemListBuilderInterface[] = [...MESSAGE_TEMPLATE_DATA_CONFIG];

  constructor(
    private messageTemplateService: MessageTemplateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTemplates(this.filterParams);
  }

  onLoadList(param: FilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.loadTemplates(param).then(() => {});
    }
  }

  async loadTemplates(param: FilterParamsInterface): Promise<void> {
    this.loading$.next(true);
    try {
      const params: MessageTemplateFilterParamsInterface = {
        ...this.filterParams,
        ...param,
      };

      if (this.searchText) {
        params.search = this.searchText;
      }

      const result = await firstValueFrom(
        this.messageTemplateService.getTemplates(params),
      );
      this.templates = result.templateList.map((item) => ({
        ...item,
        icon: 'pi pi-envelope',
      }));
      this.totalCount = result.count;
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      this.loading$.next(false);
    }
  }

  onEditTemplate(id: string): void {
    this.router.navigate(['/newsletter-management/templates/edit', id]);
  }

  onTemplateClick(template: MessageTemplateInterface): void {
    this.onEditTemplate(template.templateId);
  }
}
