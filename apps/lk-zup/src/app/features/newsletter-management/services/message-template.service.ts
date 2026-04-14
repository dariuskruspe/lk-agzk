import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MessageTemplateInterface,
  MessageTemplateFilterParamsInterface,
  MessageTemplateCreateRequestInterface,
} from '../models/message-template.interface';
import { Environment } from '../../../shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplateService {
  constructor(private http: HttpClient) {}

  getTemplates(
    params: MessageTemplateFilterParamsInterface,
  ): Observable<{ templateList: MessageTemplateInterface[], count: number }> {
    return this.http.get<{ templateList: MessageTemplateInterface[], count: number }>(
      `${Environment.inv().api}/manageNewsletter/templatesList`,
      {
        params: params as any,
      },
    );
  }

  getTemplate(id: string): Observable<MessageTemplateInterface[]> {
    return this.http.get<MessageTemplateInterface[]>(
      `${Environment.inv().api}/manageNewsletter/templates/${id}`,
    );
  }

  createTemplate(
    template: MessageTemplateCreateRequestInterface,
  ): Observable<MessageTemplateInterface> {
    return this.http.post<MessageTemplateInterface>(
      `${Environment.inv().api}/manageNewsletter/template`,
      template,
    );
  }

  updateTemplate(
    template: MessageTemplateCreateRequestInterface,
  ): Observable<{success: boolean}> {
    return this.http.put<{success: boolean}>(
      `${Environment.inv().api}/manageNewsletter/template`,
      template,
    );
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${Environment.inv().api}/manageNewsletter/template`, {
      body: { templateId: id },
    });
  }
}
