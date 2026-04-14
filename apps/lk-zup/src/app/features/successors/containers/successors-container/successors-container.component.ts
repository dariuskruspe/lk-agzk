import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { AppService } from '@shared/services/app.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import mime from 'mime';
import { SuccessorsService } from "@features/successors/sevices/successors.service";
import { EmployeeSuccessorInterface } from '@features/successors/models/successors.interface';
import { SUCCESSORS_DATA_CONFIG, SUCCESSORS_ITEM_LAYOUT } from '@features/successors/constants/successors-data-config';
import { FileBase64 } from '@shared/models/files.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { clearSelection } from '@shared/utils/DOM/common';
import { FilterService } from '@shared/services/filter.service';
import { OptionListSurveyInterface } from '@features/surveys-management/models/surveys-management.interface';

export interface SuccessorsFilterParamsInterface {
  FilterAppointmentStatus?: string;
  division?: string;
  position?: string;
  count: number;
  page: number;
  useSkip: boolean;
  fullName?: string;
}

@Component({
    selector: 'app-successors-container',
    templateUrl: './successors-container.component.html',
    styleUrls: ['./successors-container.component.scss'],
    providers: [providePreloader(ProgressBar), provideBreadcrumb('FEEDBACK', 0)],
    standalone: false
})
export class SuccessorsContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  filterValue: SuccessorsFilterParamsInterface = {
    useSkip: true,
    count: 15,
    page: 1,
  };

  dataTemplate = SUCCESSORS_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...SUCCESSORS_DATA_CONFIG];

  successorsList: {
    count: number;
    successors: EmployeeSuccessorInterface[];
  };

  currentPage = 1;

  successorStates: { name: string; id: string; color: string }[] = [];

  isDownloadLoadingSignal: WritableSignal<boolean> = signal(false);

  searchTextCopy: string;

  timeoutId: ReturnType<typeof setTimeout>;

  showFilters: boolean = false;

  positionOptionList: OptionListSurveyInterface;
  divisionOptionList: OptionListSurveyInterface;
  statusOptionList: OptionListSurveyInterface;

  constructor(
    private ref: ChangeDetectorRef,
    private successorsService: SuccessorsService,
    private preloader: Preloader,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
    private route: ActivatedRoute,
    private filterService: FilterService,
  ) {}

  ngOnInit(): void {
    this.getOptionLists();
    this.setParams();
    this.loading$.next(true);
    this.preloader.setCondition(this.loading$);
    this.getList(this.filterValue).then(() => {});
  }

  setParams(): void {
    const { queryParams } = this.route.snapshot;
    this.filterValue = {
      fullName: queryParams.fullName ? decodeURI(queryParams.fullName) : '',
      FilterAppointmentStatus: queryParams.FilterAppointmentStatus || null,
      useSkip: true,
      count: 15,
      page: +queryParams.page || 1,
      division: queryParams.division || null,
      position: queryParams.position || null,
    };
    this.currentPage = +this.filterValue.page || 1;
    this.filterValue = this.cleanEmptyProps(this.filterValue);
  }

  onLoadList(param: FilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.loading$.next(true);
      this.currentPage = +param.page;
      this.filterValue.page = +param.page;
      this.getList(this.filterValue).then(() => {
        this.loading$.next(false);
      });
    }
  }

  onSuccessorItem(data: EmployeeSuccessorInterface) {
    this.router.navigate(['successors', data.employeeID]).then();
  }

  async getList(param: SuccessorsFilterParamsInterface): Promise<void> {
    const successors = await firstValueFrom(
      this.successorsService.getSuccessorsList(param),
    );
    successors.employeeList.forEach((sub) => {
      let color = 'draft';
      switch (sub.appointmentStatus.toLowerCase()) {
        case 'заполнено':
          color = 'done';
          break;
        case 'не заполнено':
          color = 'draft';
          break;
        default:
          color = 'onapproval';
          break;
      }
      this.successorStates.push({
        id: sub.employeeID,
        name: sub.appointmentStatus,
        color: color,
      });
    });
    this.successorsList = {
      count: successors.count,
      successors: successors.employeeList.map((employee) => {
        let avatar: string;
        if (!employee.photo && employee.imageExt && employee.image64) {
          const imageExtension = employee.imageExt;

          const imageMimeType = mime.getType(imageExtension);

          const { image64 } = employee;

          avatar = `data:${imageMimeType};base64,${image64}`;
        }
        return {
          ...employee,
          photo: avatar,
          state: employee.employeeID,
        };
      }),
    };
    this.loading$.next(false);
  }

  async downloadReport(format: 'pdf' | 'xlsx'): Promise<void> {
    this.isDownloadLoadingSignal.set(true);
    let reportFile
      :
      FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.successorsService.getDownloadReport(format),
      );
    } finally {
      this.isDownloadLoadingSignal.set(false);
    }

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        reportFile.file64,
        reportFile.fileExtension,
      );
    await this.fileDownloader.download(safeURL, reportFile.fileName);
    return;
  }

  applySearchFilter(): void {
    if (this.searchTextCopy !== this.filterValue.fullName && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.searchTextCopy = this.filterValue.fullName;
    this.timeoutId = setTimeout(() => {
      this.applyFilters();
    }, 1000);
  }

  applyFilters(): void {
    this.filterValue.page = 1;
    this.loading$.next(true);
    const fullParams = { ...this.filterValue };
    const queryParams = this.cleanEmptyProps(fullParams);
    this.filterValue = queryParams;
    this.setQueryUrl(queryParams);
    this.getList(queryParams).then(() => {
      this.loading$.next(false);
    });
  }

  applyDivision(): void {
    const divisionId = this.filterValue.division;
    this.filterValue.position = null;
    this.getPositionList(divisionId).then(() => {});
    this.applyFilters();
  }

  cleanEmptyProps(obj: any): any {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ''
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }

  setQueryUrl(queryParams: Record<string, any>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  toggleFilters(e: MouseEvent): void {
    this.showFilters = !this.showFilters;
    e.stopPropagation();
    clearSelection();
    this.onFiltersDialogOutsideClick();
  }

  onFiltersDialogOutsideClick(): void {
    if (this.showFilters) {
      const blurCallback = (): void => {
        this.showFilters = false;
        this.ref.detectChanges();
        this.removeFiltersDialogOutsideClickEventListener();
      };

      this.filtersDialogOutsideClickHandler =
        this.filterService.addClickOutsideFiltersDialogEventListener(blurCallback, {
          // (!!!) Вызов обработчика события 'click' глобального объекта window (где вызывается blurCallback)
          // происходит раньше, чем вызов обработчика toggleFilters, в котором происходит переключение булевой
          // переменной showFilters, отвечающей за отображение/скрытие диалогового окна с фильтрами,
          // поэтому добавляем CSS-класс кнопки вызова диалога с фильтрами в исключения (не вызываем blurCallback)
          // во избежание нарушения логики работы.
          exceptElementClasses: ['filter-icon-button'],
        });
    } else {
      // На случай, если blurCallback, в котором происходит удаление EventListener, не будет вызван (например, при
      // передаче параметра exceptElementClasses).
      this.removeFiltersDialogOutsideClickEventListener();
    }
  }

  getOptionLists() {
    this.getPositionList().then(() => {});
    this.getDivisionList().then(() => {});
    this.getStatusOptionList().then(() => {});
  }

  async getPositionList(divisionId?: string) {
    this.positionOptionList = await firstValueFrom(
      this.successorsService.getOptions('successorsFilterPosition', {division: divisionId}),
    );
  }

  async getDivisionList() {
    this.divisionOptionList = await firstValueFrom(
      this.successorsService.getOptions('successorsFilterDivision'),
    );
  }

  async getStatusOptionList() {
    this.statusOptionList = await firstValueFrom(
      this.successorsService.getOptions('filterAppointmentStatus'),
    );
  }

  removeFiltersDialogOutsideClickEventListener(): void {
    window.removeEventListener(
      'click',
      this.filtersDialogOutsideClickHandler,
      true
    );
  }

  /**
   * Ссылка на обработчик нажатия мимо (снаружи от) диалогового окна с фильтрами.
   * Инициализируется в методе onFiltersDialogOutsideClick.
   */
  private filtersDialogOutsideClickHandler: () => void;
}
