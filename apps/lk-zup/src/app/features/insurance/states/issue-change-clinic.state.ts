import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IssuesTypesTemplateInterface } from '../../issues/models/issues-types.interface';
import { IssuesTypeService } from '../../issues/services/issues-type.service';

@Injectable({
  providedIn: 'root',
})
export class IssueChangeClinicState {
  public entityName = 'issueChangeClinic';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIssueType,
    },
  };

  constructor(private issuesTypeService: IssuesTypeService) {}

  getIssueType(data: {
    alias: string;
    owner: string;
  }): Observable<IssuesTypesTemplateInterface> {
    return this.issuesTypeService.getIssuesTypeAlias(data.alias).pipe(
      map((result) => ({
        ...result,
        template: result.template.map((field) => ({
          ...field,
          optionListRequestAlias:
            field.type === 'select'
              ? `${field.optionListRequestAlias}?owner=${data.owner}`
              : '',
        })),
      }))
    );
  }
}
