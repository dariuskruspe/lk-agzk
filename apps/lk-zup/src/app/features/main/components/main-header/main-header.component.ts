import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { ReplaySubject } from 'rxjs';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import { DocumentStatesInterface } from '../../../agreements/models/document-states.interface';
import { AgreementsStateUtils } from '../../../agreements/utils/agreements-state.utils';
import { MainSidebarFacade } from '../../facades/main-sidebar.facade';
import { AlertsInterface } from '../../models/alerts.interface';
import { MainCurrentUserInterface } from '../../models/main-current-user.interface';
import { MainNotificationsInterface } from '../../models/main-notifications.interface';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openedMenu', [
            state('opened', style({ transform: 'translateX(0)' })),
            transition('* => opened', animate('0.2s')),
            transition('opened => *', animate('0.1s')),
        ]),
    ],
    standalone: false
})
export class MainHeaderComponent implements OnChanges {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  alertsSignal: WritableSignal<AlertsInterface> =
    this.currentUserStorage.data.frontend.signal.alerts;

  employeeActiveName: string;

  employeeActiveLogoSrc: string | ArrayBuffer;

  state = 'initial';

  apiUrl = Environment.inv().api;

  toggleMenu$ = new ReplaySubject<{ type: string; value: boolean }>(1);

  @Input() notifications: MainNotificationsInterface[];

  @Input() currentUser: MainCurrentUserInterface;

  @Input() agreementDocumentState: DocumentStatesInterface;

  @Input() isOpened: boolean;

  @Input() employeeId: string;

  @Input() isMobile: boolean;

  @Input() settings: SettingsInterface;

  @Output() logout = new EventEmitter();

  @Output() initApp = new EventEmitter();

  @Output() changeLang = new EventEmitter();

  @Output() changeEmployee = new EventEmitter<string>();

  @Output() langChange = new EventEmitter<string>();

  @Output() themeChange = new EventEmitter<string>();

  @Output() deleteNotification = new EventEmitter<string>();

  @Input() pushesLoading = false;

  @Input() pushesAvailable = false;

  @Input() pushesEnabled = false;

  @Output() pushesEnable = new EventEmitter();

  @Output() pushesDisable = new EventEmitter();

  private initialized = false;

  constructor(
    private sidebarFacade: MainSidebarFacade,
    private localstorageService: LocalStorageService,
    private agreementsStateUtils: AgreementsStateUtils,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      ((changes?.currentUser?.currentValue && this.agreementDocumentState) ||
        (changes?.agreementDocumentState?.currentValue && this.currentUser)) &&
      !this.initialized
    ) {
      if (this.currentUser?.employees && this.currentUser?.employees?.length) {
        let currentEmployeeId: string;
        const docUnsignedStates = this.agreementsStateUtils.getUnsignedList(
          this.agreementDocumentState,
        );

        if (
          this.localstorageService.getCurrentEmployeeId() &&
          this.currentUser?.employees.findIndex(
            (item) =>
              item.employeeID ===
              this.localstorageService.getCurrentEmployeeId(),
          ) !== -1
        ) {
          currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
        } else {
          currentEmployeeId = this.currentUser?.employees[0]?.employeeID;
        }
        this.initApp.emit({ currentEmployeeId, docUnsignedStates });
        this.onCheckedEmployee(currentEmployeeId);
        this.initialized = true;
      }
    }

    if (changes?.openedMenu?.currentValue !== undefined) {
      this.state = changes?.openedMenu.currentValue ? 'opened' : 'initial';
    }

    if (changes?.openedMenu?.currentValue !== undefined) {
      this.state = changes?.openedMenu.currentValue ? 'opened' : 'initial';
    }
  }

  onLogout(id: string): void {
    this.logout.emit(id);
  }

  onCheckedEmployee(id: string | number): void {
    const employee = this.currentUser.employees.find(
      (e) => e.employeeID === id,
    );
    if (employee) {
      this.employeeActiveName = employee.organizationShortName;
      if (employee.logo) {
        this.getLogo(employee.logo);
      }
    }
  }

  onToggleSidebar(): void {
    this.toggleMenu$.next({ type: '', value: false });
    this.sidebarFacade.setSidebarState(!this.sidebarFacade.getData());
  }

  hasUnsignedDocs(): boolean {
    return this.localstorageService.getHasUnsignedDocuments();
  }

  toggle(value: string): void {
    this.sidebarFacade.setSidebarState(false);
    this.toggleMenu$.next({ type: value, value: true });
  }

  redirectTo(value: string[] = ['/']): void {
    this.sidebarFacade.setSidebarState(false);
    this.toggleMenu$.next({ type: '', value: false });
    this.router.navigate(value).then(() => {});
  }

  getLogo(logo: string): void {
    const getBase64Image = async (res) => {
      const blob = await res.blob();
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return reader.result;
    };

    fetch(this.apiUrl + logo, {
      headers: {
        'X-Token': this.localstorageService.getTokens(),
      },
    })
      .then(getBase64Image)
      .then((imgString) => {
        this.employeeActiveLogoSrc = imgString;
        this.ref.detectChanges();
      });
  }
}
