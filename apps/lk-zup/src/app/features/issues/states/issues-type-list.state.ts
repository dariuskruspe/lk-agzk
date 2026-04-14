import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { injectResource } from '@app/shared/services/api-resource';
import { IssueTypesResource } from '@app/shared/api-resources/issue-types.resource';

@Injectable({
  providedIn: 'root',
})
export class IssuesTypeListState {
  public entityName = 'issuesTypeList';

  private issuesTypeListResource = injectResource(IssueTypesResource);

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.issuesTypeListResource.asObservable,
    },
  };
}
