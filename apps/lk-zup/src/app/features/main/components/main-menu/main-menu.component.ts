import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DocumentListInterface } from '@features/agreements/models/agreement.interface';
import { MENU_ITEMS } from '@features/main/constants/main-menu';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import Version from '../../../../../version/version.json';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('panelMobile', [
      state('initial', style({ transform: 'translate(-100%,0)' })),
      state('expanded', style({ transform: 'translate(0,0)' })),
      transition('initial <=> expanded', [
        // query('@panelTitle', [animateChild()]),
        // query('@panelIcon', [animateChild()]),
        animate('0.15s'),
      ]),
    ]),
  ],
  standalone: false,
})
export class MainMenuComponent implements OnChanges {
  app = inject(AppService);

  destroyRef: DestroyRef = inject(DestroyRef);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  settings$: Observable<SettingsInterface> = toObservable(
    this.settingsSignal,
  ).pipe(
    filter((v: SettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef),
  );

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  userSettings$: Observable<UserSettingsInterface> = toObservable(
    this.userSettingsSignal,
  ).pipe(
    filter((v: UserSettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef),
  );

  public ver = Version;

  state = 'initial';

  isExpanded = false;

  signLater: boolean;

  items = MENU_ITEMS;

  @Input() unsignedAgreements: DocumentListInterface;

  @Input() isMobile: boolean;

  @Input() set isOpened(v: boolean) {
    this.isExpanded = v;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }

  @Input() currentUser: MainCurrentUserInterface;

  @Input() employeeId: string;

  @Output() changeEmployee = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.unsignedAgreements?.currentValue) {
      this.signLater = !!this.unsignedAgreements?.documents?.length;
    }

    if (changes?.currentUser?.currentValue) {
      this.updateCurrentUser(changes?.currentUser?.currentValue);
    }
  }

  updateCurrentUser(currentUser: MainCurrentUserInterface): void {
    const currentUserStorage = this.app.storage.user.current;
    currentUserStorage.data.backend.currentUser = currentUser;
  }

  togglePanel(): void {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }
}
