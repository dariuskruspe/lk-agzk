import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DashboardPopular } from '../models/dashboard-payslip.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { IssueTypesPopularResource } from '@app/shared/api-resources/issue-types-popular.resource';

@Injectable({
  providedIn: 'root',
})
export class DashboardPopularRequestsService {
  constructor(private http: HttpClient) {}

  issueTypesPopularResource = injectResource(IssueTypesPopularResource);

  getRequests(): Observable<DashboardPopular> {
    return this.issueTypesPopularResource.asObservable();
  }
}
