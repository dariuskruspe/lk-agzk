import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { BusinessTripsMemberListItem } from '../constants/business-trip-data-config';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsMembersService {
  constructor(private http: HttpClient) {}

  getMembers(
    sectionId: string
  ): Observable<{ members: BusinessTripsMemberListItem[] }> {
    return this.http.get<{ members: BusinessTripsMemberListItem[] }>(
      `${Environment.inv().api}/timesheet/members`,
      {
        params: {
          sectionId,
        },
      }
    );
  }
}
