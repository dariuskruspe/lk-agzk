import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AsyncBreadcrumbInterface } from '../../../shared/models/async-breadcrumb.interface';
import { IssuesTypesTemplateInterface } from '../models/issues-types.interface';
import { IssuesTypeState } from '../states/issues-type.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesTypeFacade
  extends AbstractFacade<IssuesTypesTemplateInterface>
  implements AsyncBreadcrumbInterface
{
  constructor(protected geRx: GeRx, protected store: IssuesTypeState) {
    super(geRx, store);
  }

  showIssueType(issueTypeID: string): void {
    this.geRx.show(this.store.entityName, issueTypeID);
  }

  showIssueTypeAlias(issueTypeAlias: string): void {
    this.geRx.exception(this.store.entityName, issueTypeAlias);
  }

  getLabel$(): Observable<string> {
    return this.getData$().pipe(map((v) => v.FullName));
  }
}
