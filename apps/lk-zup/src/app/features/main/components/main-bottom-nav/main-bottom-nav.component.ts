import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  HouseIcon,
  CalendarIcon,
  CirclePlusIcon,
  BellIcon,
  CircleUserIcon,
} from 'lucide-angular';
import { MainSidebarService } from '@app/features/main/services/main-sidebar.service';
import { LangModule } from '@app/shared/features/lang/lang.module';

@Component({
  selector: 'app-main-bottom-nav',
  templateUrl: './main-bottom-nav.component.html',
  styleUrl: './main-bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, LangModule],
})
export class MainBottomNavComponent {
  sidebarService = inject(MainSidebarService);

  logout = output<string>();

  readonly HouseIcon = HouseIcon;
  readonly CalendarIcon = CalendarIcon;
  readonly CirclePlusIcon = CirclePlusIcon;
  readonly BellIcon = BellIcon;
  readonly CircleUserIcon = CircleUserIcon;

  user = this.sidebarService.user;
  unreadCount = this.sidebarService.unreadNotificationsCount;

  showNotifications(): void {
    this.sidebarService.showNotifications();
  }

  showUserMenu(): void {
    this.sidebarService.showUserMenu();
  }
}
