import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideMenuModule } from '../../../shared/components/aside-menu/aside-menu.module';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-manage-layout',
    imports: [RouterOutlet, AsideMenuModule],
    templateUrl: './manage-layout.component.html',
    styleUrl: './manage-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageLayoutComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Шаблоны',
      icon: 'pi pi-file',
      routerLink: ['/admin/issue-template'],
    },
    {
      label: 'TITLE_DASHBOARD',
      icon: 'hrm-icons icon-home',
      styleClass: 'cy-main-menu-dashboard',
      routerLink: '/',
      routerLinkActiveOptions: {
        queryParams: 'ignored',
        paths: 'exact',
      },
      state: {
        getVisibility: true,
      },
    },
  ];
}
