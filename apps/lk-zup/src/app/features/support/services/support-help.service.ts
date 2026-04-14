import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  SupportHelpItemInterface,
  SupportHelpMainInterface,
  SupportHelpMenuInterface,
} from '../models/support-help.interface';

@Injectable({
  providedIn: 'root',
})
export class SupportHelpService {
  constructor(private http: HttpClient) {}

  getSupportHelpBlock(
    pageId: string,
    params: HttpParams = new HttpParams()
  ): Observable<SupportHelpMainInterface> {
    if (!pageId) {
      return of({ title: 'EMPTY_SUPPORT_PAGE', markup: null });
    }
    return this.http.get<SupportHelpMainInterface>(
      `${Environment.inv().api}/wa_support/page/${pageId}`,
      { params }
    );
  }

  getSupportHelpSideMenu(
    groupId: string
  ): Observable<SupportHelpMenuInterface[]> {
    return this.http.get<SupportHelpMenuInterface[]>(
      `${Environment.inv().api}/wa_support/groupList/${groupId}`
    );
  }

  getSupportHelpList(): Observable<SupportHelpItemInterface[]> {
    return this.http.get<SupportHelpItemInterface[]>(
      `${Environment.inv().api}/wa_support/groupList`
    );
  }
}
