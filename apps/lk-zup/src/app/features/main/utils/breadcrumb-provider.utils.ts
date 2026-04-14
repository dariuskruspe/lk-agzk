import { forwardRef, InjectionToken, Provider, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AsyncBreadcrumbInterface } from '../../../shared/models/async-breadcrumb.interface';
import { NumbersRange } from '../../../shared/models/number-range.type';
import { BreadcrumbsService } from '../services/breadcrumbs.service';

export const BREADCRUMB = new InjectionToken('breadcrumb');

function createBreadcrumb(
  depth: NumbersRange<0, 4>,
  labelSource: Type<AsyncBreadcrumbInterface> | string
): (
  breadcrumbs: BreadcrumbsService,
  router: Router,
  facade?: AsyncBreadcrumbInterface
) => void {
  return (
    breadcrumbs: BreadcrumbsService,
    router: Router,
    facade?: AsyncBreadcrumbInterface
  ) => {
    let label: Observable<string>;
    if (facade) {
      label = facade.getLabel$();
    } else {
      label = of(labelSource as string);
    }
    breadcrumbs.add({
      depth,
      label,
      url: router.url,
    });
  };
}

export function provideBreadcrumb(
  labelSource: Type<AsyncBreadcrumbInterface> | string,
  depth: NumbersRange<0, 4> = 4
): Provider {
  return {
    provide: BREADCRUMB,
    deps:
      typeof labelSource === 'string'
        ? [BreadcrumbsService, Router]
        : [BreadcrumbsService, Router, forwardRef(() => labelSource)],
    useFactory: createBreadcrumb(depth, labelSource),
  };
}
