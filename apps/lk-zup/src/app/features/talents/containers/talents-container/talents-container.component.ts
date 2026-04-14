import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit, signal, WritableSignal,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import { TalentsService } from '@features/talents/sevices/talents.service';
import { SubordinateTalentInterface } from '@features/talents/models/talents.interface';
import {
  TALENT_ITEM_LAYOUT,
  TALENTS_DATA_CONFIG,
} from '@features/talents/constants/talents-data-config';
import mime from 'mime';
import { GridCellInterface } from '@features/talents/components/talents-9-grid/talents-9-grid.component';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { FileBase64 } from '@shared/models/files.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { clearSelection } from '@shared/utils/DOM/common';
import { FilterService } from '@shared/services/filter.service';
import { OptionListSurveyInterface } from '@features/surveys-management/models/surveys-management.interface';

export interface TalentFilterParamsInterface {
  talent?: string;
  division?: string;
  position?: string;
  count: number;
  page: number;
  useSkip: boolean;
  fullName?: string;
}

@Component({
    selector: 'app-talents-container',
    templateUrl: './talents-container.component.html',
    styleUrls: ['./talents-container.component.scss'],
    providers: [providePreloader(ProgressBar), provideBreadcrumb('FEEDBACK', 0)],
    standalone: false
})
export class TalentsContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  filterValue: TalentFilterParamsInterface = {
    useSkip: true,
    count: 15,
    page: 1,
  };

  searchTextCopy: string;

  timeoutId: ReturnType<typeof setTimeout>;

  showFilters: boolean = false;

  dataTemplate = TALENT_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...TALENTS_DATA_CONFIG];

  talentsList: {
    count: number;
    talents: SubordinateTalentInterface[];
  };

  positionOptionList: OptionListSurveyInterface;
  divisionOptionList: OptionListSurveyInterface;
  talentsOptionList: OptionListSurveyInterface;

  currentPage = 1;

  talentStates: { name: string; id: string; color: string }[] = [];

  grid: GridCellInterface[][] = [
    [
      { color: '#FFA726', employees: [] }, { color: '#8BC34A', employees: [] }, { color: '#8BC34A', employees: [] }
    ],
    [
      { color: '#FF7043', employees: [] }, { color: '#FFA726', employees: []}, { color: '#8BC34A', employees: [] }
    ],
    [
      { color: '#FF7043', employees: []}, { color: '#FF7043', employees: [] }, { color: '#FFA726', employees: [] }
    ]
  ];

  activeTab: 'TALENTS' | '9-GRID' =
    'TALENTS';

  isDownloadLoadingSignal: WritableSignal<boolean> = signal(false);

  constructor(
    private ref: ChangeDetectorRef,
    private talentsService: TalentsService,
    private preloader: Preloader,
    private router: Router,
    public settingsFacade: SettingsFacade,
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
    if (this.settingsFacade.getData().talents.enable9boxGrid) {
      this.get9Grid().then(() => {});
    }
  }

  setParams(): void {
    const { queryParams } = this.route.snapshot;
    this.filterValue = {
      useSkip: true,
      count: 15,
      page: +queryParams.page || 1,
      talent: queryParams.talent || null,
      division: queryParams.division || null,
      position: queryParams.position || null,
      fullName: queryParams.fullName ? decodeURI(queryParams.fullName) : '',
    };
    this.currentPage = +this.filterValue.page || 1;
    this.filterValue = this.cleanEmptyProps(this.filterValue);
  }

  getOptionLists() {
    this.getPositionList().then(() => {});
    this.getDivisionList().then(() => {});
    this.getTalentsOptionList().then(() => {});
  }

  async getPositionList(divisionId?: string) {
    this.positionOptionList = await firstValueFrom(
      this.talentsService.getOptions('talentsFilterPosition', {division: divisionId}),
    );
  }

  async getDivisionList() {
    this.divisionOptionList = await firstValueFrom(
      this.talentsService.getOptions('talentsFilterDivision'),
    );
  }

  async getTalentsOptionList() {
    this.talentsOptionList = await firstValueFrom(
      this.talentsService.getOptions('talentsFilter'),
    );
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

  onTalentItem(data: SubordinateTalentInterface) {
    this.saveData(data);
    this.router.navigate(['talents', data.employeeID]).then();
  }

  async getList(param: TalentFilterParamsInterface): Promise<void> {
    const employees = await firstValueFrom(
      this.talentsService.getTalentsList(param),
    );
    employees.subordinates.forEach((sub) => {
      this.talentStates.push({
        id: sub.employeeID,
        name: sub.talent || 'Необходимо заполнить',
        color: sub.color || 'draft',
      });
    });
    this.talentsList = {
      count: employees.count,
      talents: employees.subordinates.map((employee) => {
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

  async get9Grid() {
    const gridValue = await firstValueFrom(
      this.talentsService.getGrid(),
    );
    gridValue.employees.forEach(employee => {
      const imageExtension = employee.imageExt;

      const imageMimeType = mime.getType(imageExtension);

      const { image64 } = employee;

      const employeePhoto = image64 ? `data:${imageMimeType};base64,${image64}` : 'assets/img/svg/user-circle.svg';
      const indexX = employee.points.efficiency < 3 ? 0 : employee.points.efficiency < 7 ? 1 : 2;
      const indexY = employee.points.potential < 3 ? 0 : employee.points.potential < 7 ? 1 : 2;
      this.grid[indexX][indexY].employees.push({
        name: employee.fullName,
        photo: employeePhoto,
        id: employee.employeeID
      })
    });
  }

  saveData(data: SubordinateTalentInterface): void {
    localStorage.setItem('talentEmployeeData', JSON.stringify(data));
  }

  changeTab(tabName: 'TALENTS' | '9-GRID'): void {
    if (this.activeTab !== tabName) {
      this.activeTab = tabName;
    }
  }

  async downloadReport(format: 'pdf' | 'xlsx'): Promise<void> {
    this.isDownloadLoadingSignal.set(true);
    let reportFile
      :
      FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.talentsService.getDownloadReport(format),
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
    this.loading$.next(true);
    this.filterValue.page = 1;
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
