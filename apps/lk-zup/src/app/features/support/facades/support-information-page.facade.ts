import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AsyncBreadcrumbInterface } from '../../../shared/models/async-breadcrumb.interface';
import { SupportHelpMainInterface } from '../models/support-help.interface';
import { SupportInformationPageState } from '../states/support-information-page.state';

@Injectable({
  providedIn: 'root',
})
export class SupportInformationPageFacade
  extends AbstractFacade<SupportHelpMainInterface>
  implements AsyncBreadcrumbInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: SupportInformationPageState
  ) {
    super(geRx, store);
  }

  getSupportPage(pageId: string): void {
    this.geRx.show(this.store.entityName, pageId);
  }

  getLabel$(): Observable<string> {
    return this.getData$().pipe(
      map((value: SupportHelpMainInterface) => value.title)
    );
  }
}
