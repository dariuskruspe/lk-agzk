import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { ZERO_BREADCRUMBS } from '../constants/zero-breadcrumbs';
import {
  CachedBreadcrumbsInterface,
  MainBreadcrumbsInterface,
} from '../models/main-breadcrumbs.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private breadcrumbs: MainBreadcrumbsInterface[] = [];

  private breadcrumbsSubj: Subject<MainBreadcrumbsInterface[]> = new Subject();

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  add(breadcrumb: MainBreadcrumbsInterface): void {
    this.breadcrumbs = this.breadcrumbs.slice(0, breadcrumb.depth);
    const lastBreadcrumb =
      this.breadcrumbs?.[
        this.breadcrumbs.length ? this.breadcrumbs.length - 1 : 0
      ];
    if (lastBreadcrumb && breadcrumb.url === lastBreadcrumb?.url) {
      return;
    }
    this.breadcrumbs.push(breadcrumb);
    if (!this.hasZeroDepth()) {
      this.addZeroBreadcrumb();
    }
    this.breadcrumbsSubj.next(this.breadcrumbs);
  }

  goBack(): void {
    const breadcrumb =
      this.breadcrumbs[
        this.breadcrumbs.length - 2 >= 0 ? this.breadcrumbs.length - 2 : 0
      ];
    this.router.navigateByUrl(breadcrumb.url);
  }

  saveBreadcrumbs(breadcrumbs: CachedBreadcrumbsInterface[]): void {
    this.localStorage.saveBreadcrumbs(breadcrumbs);
  }

  get breadcrumbs$(): Observable<MainBreadcrumbsInterface[]> {
    return this.breadcrumbsSubj.asObservable();
  }

  private hasZeroDepth(): boolean {
    return this.breadcrumbs[0].depth === 0;
  }

  private addZeroBreadcrumb(): void {
    const cachedBreadcrumbs = this.unarchiveBreadcrumbs();
    if (cachedBreadcrumbs && cachedBreadcrumbs.length) {
      this.breadcrumbs = cachedBreadcrumbs;
      return;
    }
    let zeroBreadcrumb = ZERO_BREADCRUMBS.find((breadcrumb, index) => {
      return index && this.router.url.startsWith(breadcrumb.url);
    });
    if (!zeroBreadcrumb) {
      zeroBreadcrumb = ZERO_BREADCRUMBS[0];
    }
    this.breadcrumbs.unshift(zeroBreadcrumb);
  }

  private unarchiveBreadcrumbs(): MainBreadcrumbsInterface[] | null {
    const archivedBreadcrumbs = this.localStorage.getBreadcrumbs();
    if (!archivedBreadcrumbs) {
      return null;
    }
    return archivedBreadcrumbs.map((item) => ({
      ...item,
      label: of(item.label),
    }));
  }
}
