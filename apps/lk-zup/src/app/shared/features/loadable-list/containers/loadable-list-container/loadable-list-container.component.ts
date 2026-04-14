import {
  AfterViewInit,
  Component,
  EventEmitter, inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { FpcFilterInterface } from '@shared/features/fpc-filter/models/fpc-filter.interface';
import { WindowsWidthService } from '@shared/services/windows-width.service';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { LoadableListScrollPositionFacade } from '../../facades/loadable-list-scroll-position.facade';
import { LoadableListDataInterface } from '../../models/loadable-list-data.interface';
import { LoadableListPaginationInterface } from '../../models/loadable-list-pagination.interface';
import {AppService} from "@shared/services/app.service";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'loadable-list-container',
    templateUrl: './loadable-list-container.component.html',
    styleUrls: ['./loadable-list-container.component.scss'],
    standalone: false
})
export class LoadableListContainerComponent
  implements OnChanges, AfterViewInit
{
  private readonly uncountableFilterKeys = ['page', 'count'];

  page = this.activatedRoute.snapshot.queryParams.page || 1;

  count = this.activatedRoute.snapshot.queryParams.count || 15;

  backPage = this.activatedRoute?.snapshot?.queryParams?.back;

  filterValue: { [name: string]: string } = {};

  listSize!: number;

  filterSize: number | null = null;

  isAllSelected = false;

  searchText = '';

  timeoutId;

  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  @Output() loadList = new EventEmitter();

  @Output() clickItem = new EventEmitter();

  @Output() clickButton = new EventEmitter();

  @Output() clickSelectedList = new EventEmitter();

  @Input() pagination = true;

  @Input() set filter(value: FpcInterface) {
    if (!value) return; // чтобы не показывать поля-фильтры, если ничего не передано (не отображаем старые фильтры)
    this.newFilter = {
      options: value.options,
      main: [value.template[0]],
      secondary: value.template.filter((_, i) => !!i),
    };
  }

  newFilter: FpcFilterInterface;

  @Input() dataConfig: ItemListBuilderInterface[];

  @Input() dataList: LoadableListDataInterface & any;

  @Input() set template(value: ListLayoutsInterface) {
    if (value) {
      this.fullTemplate = value;
      if (!value?.s) {
        this.fullTemplate.s = this.fullTemplate.m;
      }
      if (!value?.l) {
        this.fullTemplate.l = this.fullTemplate.m;
      }
    }
  }

  @Input() appendFilterToQuery = false;

  @Input() takeCount: number;

  fullTemplate: ListLayoutsInterface;

  @Input() otherData: any;

  @Input() scrollContainerClassCss: string;

  @Input() loading: boolean;

  @Input() select: boolean = false;

  @Input() selectButtonTitle: string;

  @Input() rejectButtonTitle: string;

  @Input() highlight: (arg: unknown) => boolean = () => false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loadableListScrollPositionFacade: LoadableListScrollPositionFacade,
    public windowWidthService: WindowsWidthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.filter?.currentValue &&
      changes?.filter?.currentValue?.template
    ) {
      this.setFilterValue(changes?.filter?.currentValue?.template);
    }
    if (this.filter?.data && this.filterSize === null) {
      this.filterSize = this.countFilterSize(
        this.filter?.data as Record<string, unknown>
      );
    }
    if (this.dataList) {
      this.listSize = this.dataList.count;
      this.dataList.documents?.forEach((item) => {
        item.selected = false;
      });
      this.dataList.issues?.forEach((item) => {
        item.selected = false;
      });
    }
  }

  ngAfterViewInit(): void {
    let queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
    };
    if (this.pagination) {
      queryParams.useSkip = true;
    }
    if (
      !this.pagination &&
      !this.loadableListScrollPositionFacade?.getData()?.position
    ) {
      this.changeQueryParam({ page: 1, ...this.filterValue });
      queryParams = { ...queryParams, page: 1 };
    }
    queryParams = { ...queryParams, count: this.count, ...this.filterValue };
    this.onLoadList(queryParams);
  }

  setFilterValue(template: FpcInputsInterface[]): void {
    for (const item of template) {
      if (item && item.value) {
        this.filterValue[item.formControlName] = String(item.value);
      }
    }
  }

  onFilterSubmit<T extends { search: string }>(value: T): void {
    this.isAllSelected = false;
    if (this.select) {
      this.selectAll({ checked: false });
    }

    if (!!value.search && value.search !== this.searchText) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.searchText = value.search;
      this.timeoutId = setTimeout(() => {
        this.applyFilter(value);
      }, 1000);
    } else {
      this.applyFilter(value);
    }
  }

  applyFilter<T>(value: T): void {
    const filterValue = { ...value };
    this.filterSize = this.countFilterSize(
      filterValue as Record<string, unknown>
    );
    this.loadableListScrollPositionFacade.savePosition(0);
    this.changeQueryParam({ ...filterValue, page: 1 });
    this.onLoadList({ ...filterValue, page: 1, count: this.count });
  }

  onLoadList(param: unknown): void {
    this.loadList.emit(param);
  }

  onClickItem(data: unknown): void {
    this.clickItem.emit(data);
  }

  onClickButton(data: unknown): void {
    this.clickButton.emit(data);
  }

  changeQueryParam(params: unknown, removeList?: string[]): void {
    let queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
    };
    const trimQueryParams = {};
    queryParams = Object.assign(
      queryParams,
      this.appendFilterToQuery ? params || {} : {}
    );
    if (removeList && Array.isArray(removeList)) {
      for (const name of removeList) {
        delete queryParams[name];
      }
    }
    for (const key of Object.keys(queryParams)) {
      if (
        Array.isArray(queryParams[key])
          ? queryParams[key].length
          : queryParams[key]
      ) {
        trimQueryParams[key] = queryParams[key];
      }
    }
    this.router
      .navigate(['.'], {
        relativeTo: this.activatedRoute,
        queryParams: trimQueryParams,
      })
      .then();
  }

  saveScrollPosition(scrollPosition: number): void {
    this.loadableListScrollPositionFacade.savePosition(scrollPosition);
  }

  onListLoadable(): void {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
    };
    this.onLoadList({
      ...queryParams,
      page: +this.page + 1,
      count: this.count,
    });
    this.changeQueryParam({ page: +this.page + 1 });
    this.page += 1;
  }

  onListPagination(data: LoadableListPaginationInterface): void {
    this.isAllSelected = false;
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
    };
    this.onLoadList({
      ...queryParams,
      page: data.page + 1,
      count: data.rows,
      useSkip: true,
    });
    this.changeQueryParam({ page: data.page + 1, count: data.rows });
    this.page = data.page + 1;
  }

  getActiveFilterCount(): boolean {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
    };
    const queryParamsKeys = Object.keys(queryParams);
    queryParamsKeys.splice(Object.keys(queryParams).indexOf('page'), 1);
    return !!queryParamsKeys.length;
  }

  private countFilterSize(filter: Record<string, any>): number {
    return Object.keys(filter).filter(
      (key) =>
        !this.uncountableFilterKeys.includes(key) &&
        filter[key] &&
        filter[key]?.length !== 0
    ).length;
  }

  selectAll(data: { checked: boolean }): void {
    console.log(data.checked);
    const files = this.dataList.documents || this.dataList.issues;
    const statuses =
      this.otherData.issuesStatusList?.states || this.otherData.documentsStates;
    if (data.checked) {
      files.forEach((item) => {
        const status = statuses.find((stat) => {
          return stat.id === item.state;
        });
        if (status.approve || status.sign === false) {
          item.selected = true;
        }
      });
    } else {
      files.forEach((item) => {
        item.selected = false;
      });
    }
  }

  get hasSelectedItems(): boolean {
    let hasSelected = false;
    const files = this.dataList?.documents || this.dataList?.issues || [];
    files.forEach((item) => {
      if (item.selected) {
        hasSelected = true;
      }
    });
    return hasSelected;
  }

  signList(reject: boolean): void {
    const files = this.dataList.documents || this.dataList.issues;
    const selectedDocuments = files.filter((item) => item.selected);
    if (selectedDocuments.length) {
      this.clickSelectedList.emit({ selectedDocuments, reject });
    }
  }

  hasUnsigned(): boolean {
    if (
      this.dataList?.documents?.length &&
      this.otherData?.documentsStates?.length
    ) {
      let has = false;
      this.dataList.documents.forEach((doc) => {
        const state = this.otherData.documentsStates.find((st) => {
          return st.id === doc.state;
        });
        if (state.sign === false) {
          has = true;
        }
      });
      return has;
    } else {
      return true;
    }
  }
}
