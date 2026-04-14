import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../../components/item-list-builder/models/item-list-builder.interface';
import { LoadableListDataInterface } from '../../models/loadable-list-data.interface';
import { LoadableListPaginationInterface } from '../../models/loadable-list-pagination.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'loadable-list',
    templateUrl: './loadable-list.component.html',
    styleUrls: ['./loadable-list.component.scss'],
    standalone: false
})
export class LoadableListComponent implements OnChanges, AfterViewInit {
  loaderRootMargin = '0px 0px 10px 0px';

  loaderThreshold = 1.0;

  scrollContainer;

  pageLinkSize = 4;

  data: unknown[];

  stateList: unknown[];

  paginationData: LoadableListPaginationInterface;

  @Input() takeCount: number;

  @Output() clickItem = new EventEmitter<unknown>();

  @Output() clickButton = new EventEmitter<unknown>();

  @Output() listLoadable = new EventEmitter<number>();

  @Output()
  listPagination = new EventEmitter<LoadableListPaginationInterface>();

  @Output() saveScrollPosition = new EventEmitter<number>();

  @ViewChild('listLoadableSeparator')
  listLoadableSeparator: ElementRef<HTMLElement>;

  @ViewChild('paginator') paginator: Paginator;

  @Input() template: ListLayoutsInterface;

  displayedNames: string[] = [];

  @Input() widthType: 's' | 'm' | 'l';

  @Input() pagination: boolean;

  @Input() dataConfig: ItemListBuilderInterface[];

  displayedConfig: ItemListBuilderInterface[];

  @Input() dataList: LoadableListDataInterface;

  /**
   * Сообщение об отсутствии данных (когда список пуст).
   */
  @Input() noDataText: string = '';

  @Input() otherData: unknown;

  @Input() scrollContainerClassCss: string;

  @Input() backPage: boolean;

  @Input() scrollPosition: number | null;

  @Input() loading: boolean;

  @Input() highlight: (arg: unknown) => boolean = () => false;

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (this.widthType && this.dataConfig && changes.template?.currentValue) ||
      (this.widthType && this.template && changes.dataConfig?.currentValue) ||
      (this.template && this.dataConfig && changes.widthType?.currentValue)
    ) {
      const displayedNames = Array.from(
        this.template[this.widthType]
          .split('"')
          .filter((_, i) => i % 2 !== 0)
          .reduce((acc: Set<string>, v) => {
            v.split(' ').forEach((name) => {
              acc.add(name);
            });
            return acc;
          }, new Set())
          .values()
      ) as string[];

      this.displayedConfig = this.dataConfig.filter((item) =>
        displayedNames.includes(item.name)
      );
    }
    if (window.innerWidth <= 960) {
      this.pageLinkSize = 1;
    }
    this.updateCurrentPage();
    if (this.dataList?.count || this.dataList?.count === 0) {
      for (const key of Object.keys(this.dataList)) {
        if (key !== 'count' && this.dataList[key] instanceof Array) {
          this.data = this.dataList[key];
        }
      }

      if (this.scrollPosition) {
        setTimeout(() => {
          this.scrollContainer.scrollTo(0, this.scrollPosition);
        });
      }
      if (this.scrollContainer) {
        this.scrollContainer.scrollTo(0, 0);
      }
    }
    if (this.otherData) {
      this.stateList = this.getDeepArray(this.otherData);
    }
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.scrollContainerClassCss
      ? document.querySelector(this.scrollContainerClassCss)
      : window;
    this.listLoadableInit();
  }

  listLoadableInit(): void {
    const options = {
      rootMargin: this.loaderRootMargin,
      threshold: this.loaderThreshold,
    };
    const callback = (entries) => {
      if (
        this.scrollContainer.scrollTop &&
        entries &&
        entries[0] &&
        entries[0].intersectionRatio
      ) {
        this.saveScrollPosition.emit(this.scrollContainer.scrollTop);
        this.onListLoadable();
      }
    };
    if (!this.pagination) {
      const observer = new IntersectionObserver(callback, options);
      observer.observe(this.listLoadableSeparator.nativeElement);
    }
  }

  onListLoadable(): void {
    const dataListAttrArr = Object.keys(this.dataList);

    const getCountIndex = dataListAttrArr.indexOf('count');
    dataListAttrArr.splice(getCountIndex, 1);
    if (this.dataList[dataListAttrArr[0]].length < this?.dataList?.count) {
      this.listLoadable.emit(this.scrollContainer.scrollTop);
      this.scrollContainer.scrollTo(0, this.scrollContainer.scrollTop + 100);
    }
  }

  onClick(data: unknown, index: number): void {
    this.saveScrollPosition.emit(this.scrollContainer.scrollTop);
    if (typeof data === 'object') {
      this.clickItem.emit({ ...data, index });
    } else {
      this.clickItem.emit({ data, index });
    }
  }

  onButtonClick(data: unknown): void {
    this.clickButton.emit(data);
  }

  private getDeepArray(data: unknown): unknown[] {
    for (const key of Object.keys(data)) {
      if (data[key] instanceof Array) {
        return data[key];
      }
      if (data[key] instanceof Object) {
        return this.getDeepArray(data[key]);
      }
    }
    return [];
  }

  onPaginate(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    console.log('tagName', target.tagName);
    if (
      (target.tagName === 'BUTTON' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'svg' ||
        target.tagName === 'path' ||
        target.tagName === 'LI') &&
      target.classList.value.indexOf('pi-chevron-down') === -1
    ) {
      this.listPagination.emit(this.paginationData);
    }
  }

  onSetPaginate(event: LoadableListPaginationInterface): void {
    this.paginationData = event;
  }

  updateCurrentPage(): void {
    setTimeout(() =>
      this.paginator?.changePage(
        +this.activatedRoute?.snapshot?.queryParams?.page - 1
      )
    );
  }
}
