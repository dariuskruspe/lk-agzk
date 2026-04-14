import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MainSidebarService } from '../../services/main-sidebar.service';
import { MainNotificationsService } from '../../services/main-notifications.service';
import { MainNotificationsInterface } from '../../models/main-notifications.interface';
import { UserStateService } from '@shared/states/user-state.service';
import { firstValueFrom } from 'rxjs';
import { toPromise } from '@app/shared/utilits/to-promise';
import { PushesService } from '@shared/features/pushes/services/pushes.service';
import { NotificationItemInterface } from '@app/features/main/models/notifications.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-notifications-overlay',
  templateUrl: './main-notifications-overlay.component.html',
  styleUrl: './main-notifications-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MainNotificationsOverlayComponent {
  private mainNotificationsService = inject(MainNotificationsService);
  private userState = inject(UserStateService);
  private router = inject(Router);
  private sidebarService = inject(MainSidebarService);
  pushes = inject(PushesService);

  close = output<void>();

  loading = signal(false);
  error = signal<string | null>(null);
  notifications = signal<MainNotificationsInterface[]>([]);

  left = input<string>('0px');

  protected readonly skeletonPlaceholders = Array.from(
    { length: 4 },
    (_, index) => index,
  );

  normalizedNotifications = computed(() => {
    return this.notifications()
      .map((item) => ({
        id: item.id,
        issueId: item.issueID,
        ownerId: item.OwnerID,
        owner: item.fileOwner,
        message: item.body,
        date: item.date,
        icon: item.iconName,
        title: item.ownerName,
        isViewed: item.isViewed,
        RoleSignatory: item.RoleSignatory,
      }))
      .sort((x, y) => {
        return x.isViewed === y.isViewed ? 0 : x.isViewed ? -1 : 1;
      });
  });

  abortController = new AbortController();

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.abortController?.abort();
  }

  enablePushes() {
    this.pushes.enable(true).then(() => {});
  }
  disablePushes() {
    this.pushes.disable().then(() => {});
  }

  async onDeleteNotification(targetItem: NotificationItemInterface | void) {
    if (targetItem) {
      this.notifications.update((data) =>
        data.filter((item) => item.id !== targetItem?.id),
      );

      await toPromise(
        this.mainNotificationsService.deleteNotifications({
          id: targetItem?.id,
          currentEmployeeId: this.userState.activeEmployeeId(),
        }),
      );
    } else {
      this.notifications.set([]);
      await toPromise(
        this.mainNotificationsService.deleteNotificationsAll(
          this.userState.activeEmployeeId(),
        ),
      );
    }
  }

  openNotification(item: NotificationItemInterface): void {
    this.close.emit();
    if (item.issueId) {
      const section: string[] =
        item.RoleSignatory === 'Сотрудник' || !item.RoleSignatory
          ? ['issues', 'list']
          : ['issues-management'];
      this.router.navigate([...section, item.issueId], {
        queryParams: {
          tab: item.message.toLowerCase().includes('добавлен комментарий')
            ? 'history'
            : 'issue',
        },
      });
    } else if (item.RoleSignatory) {
      switch (item.RoleSignatory) {
        case 'Сотрудник':
          this.router.navigate(['my-documents', item.owner, item.ownerId]);
          break;
        case 'Организация':
          this.router.navigate(['documents', item.owner, item.ownerId]);
          break;
        case 'Руководитель':
          this.router.navigate([
            'documents-employee',
            item.owner,
            item.ownerId,
          ]);
          break;
      }
    }
  }

  setNotificationsViewed(ids?: string[]): void {
    if (!ids || ids.length === 0) {
      return;
    }
    this.notifications.update((data) =>
      data.map((item) =>
        ids.includes(item.id) ? { ...item, isViewed: true } : item,
      ),
    );

    this.mainNotificationsService.setNotificationsViewed(
      this.userState.activeEmployeeId(),
      ids,
    );
    this.sidebarService.updateUnreadNotificationsCount(ids.length);
  }

  private async loadData() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.error.set(null);
    this.loading.set(true);
    try {
      const data = await toPromise(
        this.mainNotificationsService.getNotifications(
          this.userState.activeEmployeeId(),
        ),
        this.abortController.signal,
      );
      this.notifications.set(data);
    } catch (error) {
      this.error.set(error.message);
    } finally {
      this.loading.set(false);
    }
  }
}
