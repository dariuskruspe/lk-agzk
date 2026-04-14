import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { OptionListInterface } from '../models/option-list.interface';

@Injectable({
  providedIn: 'root',
})
export class OptionListService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  showOptionList(data: {
    alias: string;
    employeeId?: string;
  }): Observable<OptionListInterface> {
    const currentUrl = this.router.url;
    const isIssuesManagementPage = currentUrl.includes('/issues-management') || currentUrl.includes('/?tab=');

    let processedAlias = data.alias;

    // Если заявка открыта на странице issues-management, то добавляем параметр employeeId к запросу списков выбора
    if (isIssuesManagementPage && data.employeeId) {
      const separator = data.alias.includes('?') ? '&' : '?';
      processedAlias = `${data.alias}${separator}employeeId=${data.employeeId}`;
    }

    console.log('processedAlias', processedAlias);

    return this.http.get<OptionListInterface>(
      `${Environment.inv().api}/wa_issueTypes/optionList/${processedAlias}`,
    );
  }
}
