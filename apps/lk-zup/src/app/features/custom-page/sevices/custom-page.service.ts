import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { SupportHelpMainInterface } from '@features/support/models/support-help.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomPageService {
  constructor(private http: HttpClient) {}

  getContent(id: string): Observable<SupportHelpMainInterface> {
    return this.http.get<SupportHelpMainInterface>(
      `${Environment.inv().api}/section_content/${id}`,
    );
  }
}
