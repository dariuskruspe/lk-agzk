import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { MainEmployeeAlertsService } from '@features/main/services/main-employee-alerts.service';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { fromEvent, SubscriptionLike } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertsInterface } from '../../models/alerts.interface';
import { NotificationItemInterface } from '../../models/notifications.interface';
import { XIcon, BellIcon, BellOffIcon } from 'lucide-angular';

@Component({
  selector: 'app-notifications-window',
  templateUrl: './notifications-window.component.html',
  styleUrls: ['./notifications-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openedMenu', [
      state('opened', style({ transform: 'translateX(0)' })),
      transition('* => opened', animate('0.2s')),
      transition('opened => *', animate('0.1s')),
    ]),
  ],
  standalone: false,
})
export class NotificationsWindowComponent
  implements OnInit, OnDestroy, AfterViewChecked, OnChanges
{
  app: AppService = inject(AppService);

  employeeAlertsService: MainEmployeeAlertsService = inject(
    MainEmployeeAlertsService,
  );

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  alertsSignal: WritableSignal<AlertsInterface> =
    this.currentUserStorage.data.frontend.signal.alerts;

  @Input() pushesLoading = false;

  @Input() pushesAvailable = false;

  @Input() pushesEnabled = false;

  @Output() enablePushes = new EventEmitter();

  @Output() disablePushes = new EventEmitter();

  @Input() items: NotificationItemInterface[];

  @Output() clicked = new EventEmitter<NotificationItemInterface>();

  @Output() closed = new EventEmitter<NotificationItemInterface | void>();

  @Output() viewed = new EventEmitter<string[]>();

  @Output() windowClosed = new EventEmitter<void>();

  private scrollSub: SubscriptionLike;

  readonly XIcon = XIcon;
  readonly BellIcon = BellIcon;
  readonly BellOffIcon = BellOffIcon;

  togglePushes() {
    if (this.pushesEnabled) {
      this.disablePushes.emit();
    } else {
      this.enablePushes.emit();
    }
  }

  ngOnDestroy(): void {
    this.employeeAlertsService.isNotificationsOverlayOpened = false;
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.items &&
      changes.items &&
      changes.items.currentValue &&
      changes.items.currentValue.length
    ) {
      this.items = this.items.sort((x, y) => {
        return x.isViewed === y.isViewed ? 0 : x.isViewed ? 1 : -1;
      });
      setTimeout(() => {
        this.onScroll();
      }, 100);
    }
  }

  ngOnInit(): void {
    this.employeeAlertsService.isNotificationsOverlayOpened = true;
  }

  onScroll() {
    const ids = [];
    this.items.forEach((item, index) => {
      const el = document.getElementById(index.toString());
      if (el && this.elementIsVisibleInViewport(el)) {
        item.checked = true;
        if (!item.isViewed && !ids.includes(item.id)) {
          ids.push(item.id);
        }
      }
    });
    this.viewed.emit(ids);
  }

  elementIsVisibleInViewport(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    return parentRect.bottom >= rect.bottom;
  }

  ngAfterViewChecked(): void {
    const el = document.getElementsByClassName('notification-window__items');
    this.scrollSub = fromEvent<Event>(el, 'scroll')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.onScroll();
      });
  }
}
