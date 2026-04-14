import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { TranslatePipe } from '../../../shared/features/lang/pipes/lang.pipe';
import { parseUrl } from '../../../shared/utilits/parse-url.util';

@Injectable({
  providedIn: 'root',
})
export class MainMenuVisibilityService {
  private menuItems: MenuItem[];

  private menuItemsSubj = new ReplaySubject<MenuItem[]>(1);

  constructor(private router: Router, private translatePipe: TranslatePipe) {}

  setItems(items: MenuItem[]): void {
    const firstlyLoaded = !this.menuItems?.length && !!items.length;

    this.menuItems = items;
    this.menuItemsSubj.next(this.menuItems);

    // Навигация необходима, чтоб закрыть текущую страницу, если она не должна быть видна
    if (firstlyLoaded) {
      const allowedUrl: string =
        !this.hasItemByUrl('/') && !this.router.url.includes('signature')
          ? '/my-documents'
          : this.router.url;
      const parsedUrl = parseUrl(allowedUrl);
      const params = parsedUrl.isEmpty ? {} : parsedUrl.params;
      this.router.navigate(parsedUrl.path, {
        queryParams: params,
      });
    }
  }

  hasItemByUrl(url: string): boolean {
    if (!this.menuItems?.length || url.startsWith('/issues/types') || url.startsWith('/issues/list/')) {
      // При пустом значении меню, возвращаем true, чтобы не блокировать навигацию
      return true;
    }
    return !!this.menuItems?.find((item) =>
      this.findCoincidenceByUrl(item, url)
    );
  }

  hasItemByLabel(label: string): boolean {
    if (!this.menuItems?.length) {
      return false;
    }
    return !!this.menuItems?.find((item) =>
      this.findCoincidenceByLabel(item, label)
    );
  }

  get menuItems$(): Observable<MenuItem[]> {
    return this.menuItemsSubj.asObservable();
  }

  private findCoincidenceByUrl(item: MenuItem, url: string): boolean {
    const activatedUrl = url.split('?')[0];
    if (
      (activatedUrl !== '/' && url.startsWith(item.routerLink)) ||
      (activatedUrl === '/' && activatedUrl === item.routerLink)
    ) {
      return true;
    }

    if (item.items) {
      return !!item.items.find((subItem) =>
        this.findCoincidenceByUrl(subItem, url)
      );
    }

    return false;
  }

  private findCoincidenceByLabel(item: MenuItem, label: string): boolean {
    if (item.label === this.translatePipe.transform(label)) {
      return true;
    }

    if (item.items) {
      return !!item.items.find((subItem) =>
        this.findCoincidenceByLabel(subItem, label)
      );
    }

    return false;
  }
}
