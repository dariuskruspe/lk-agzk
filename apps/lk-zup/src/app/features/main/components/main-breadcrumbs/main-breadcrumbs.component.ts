import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, zip } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { MainBreadcrumbsInterface } from '../../models/main-breadcrumbs.interface';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';

@Component({
    selector: 'app-main-breadcrumbs',
    templateUrl: './main-breadcrumbs.component.html',
    styleUrls: ['./main-breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MainBreadcrumbsComponent implements OnDestroy {
  readonly breadcrumbs$: Observable<MainBreadcrumbsInterface[]>;

  private destroy$ = new Subject<void>();

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private router: Router
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;

    let cachedBreadcrumbs;
    this.breadcrumbs$
      .pipe(
        tap((breadcrumbs) => {
          cachedBreadcrumbs = breadcrumbs;
        }),
        switchMap((breadcrumbs) =>
          zip(...breadcrumbs.map((breadcrumb) => breadcrumb.label))
        ),
        tap((labels) => {
          cachedBreadcrumbs = cachedBreadcrumbs.map((breadcrumb, i) => ({
            ...breadcrumb,
            label: labels[i],
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() =>
        this.breadcrumbsService.saveBreadcrumbs(cachedBreadcrumbs)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  open(url: string): void {
    const [path, params] = url.split('?', 2);
    const parsedParams = params?.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=', 2);
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    this.router.navigate([path], { queryParams: parsedParams });
  }
}
