import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MainSidebarService } from '../../services/main-sidebar.service';
import { LogOutIcon } from 'lucide-angular';

@Component({
  selector: 'app-main-user-menu-overlay',
  templateUrl: './main-user-menu-overlay.component.html',
  styleUrl: './main-user-menu-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MainUserMenuOverlayComponent {
  private sidebarService = inject(MainSidebarService);

  close = output<void>();
  logout = output<string>();

  left = input<string>('0px');

  userMenuItems = this.sidebarService.userMenuItems;
  user = this.sidebarService.user;

  readonly LogOutIcon = LogOutIcon;

  onMenuLinkClick(): void {
    this.close.emit();
  }

  onLogout(): void {
    const user = this.user();
    if (user) {
      this.logout.emit(user.userID);
    }
    this.close.emit();
  }
}

