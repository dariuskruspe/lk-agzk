import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { Observable } from 'rxjs';
import {
  CustomSection,
  CustomSectionContent,
  CustomSectionSaveRequest,
  CustomSectionSaveResponse,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class CustomSectionsApiService {
  constructor(private http: HttpClient) {}

  getSectionList(): Observable<CustomSection[]> {
    return this.http.get<CustomSection[]>(
      `${Environment.inv().api}/wa_sections/section_list`,
    );
  }

  getSectionContent(id: string): Observable<CustomSectionContent> {
    return this.http.get<CustomSectionContent>(
      `${Environment.inv().api}/section_content/${id}`,
    );
  }

  saveSectionContent(
    data: CustomSectionSaveRequest,
  ): Observable<CustomSectionSaveResponse> {
    return this.http.post<CustomSectionSaveResponse>(
      `${Environment.inv().api}/wa_sections/section_page`,
      data,
    );
  }
}
