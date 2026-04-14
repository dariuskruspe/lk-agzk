import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NewsletterInterface,
  NewsletterFilterParamsInterface,
  NewsletterCreateRequestInterface,
  NewsletterUpdateRequestInterface,
} from '../models/newsletter.interface';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { OptionListSurveyInterface } from '@app/features/surveys-management/models/surveys-management.interface';
import { MessageTemplateInterface } from '../models/message-template.interface';
import { FileBase64 } from '@app/shared/models/files.interface';
import { LocalStorageService } from '@app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {

  private localStorageService = inject(LocalStorageService);

  constructor(private http: HttpClient) {}

  getNewsletters(
    params: NewsletterFilterParamsInterface,
  ): Observable<{ newsletterList: NewsletterInterface[], count: number }> {
    return this.http.get<{ newsletterList: NewsletterInterface[], count: number }>(
      `${Environment.inv().api}/manageNewsletter/newslettersList`,
      {
        params: params as any,
      },
    );
  }

  getNewsletter(id: string): Observable<NewsletterUpdateRequestInterface[]> {
    return this.http.get<NewsletterUpdateRequestInterface[]>(
      `${Environment.inv().api}/manageNewsletter/newsletters/${id}`,
    );
  }

  createNewsletter(
    newsletter: NewsletterCreateRequestInterface,
  ): Observable<NewsletterInterface> {
    return this.http.post<NewsletterInterface>(
      `${Environment.inv().api}/manageNewsletter/newsletter`,
      newsletter,
    );
  }

  updateNewsletter(
    newsletter: NewsletterCreateRequestInterface,
  ): Observable<NewsletterInterface> {
    return this.http.put<NewsletterInterface>(
      `${Environment.inv().api}/manageNewsletter/newsletter`,
      newsletter,
    );
  }

  deleteNewsletter(id: string): Observable<void> {
    return this.http.delete<void>(`${Environment.inv().api}/manageNewsletter/newsletter`, {
      body: { newsletterId: id },
    });
  }

  confirmNewsletter(
    confirmation: any,
  ): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${Environment.inv().api}/manageNewsletter/newsletterConfirmation`,
      confirmation,
    );
  }

  getOptions(alias: string, params?: any): Observable<OptionListSurveyInterface> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        if (params[key]) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
    return this.http.get<OptionListSurveyInterface>(
      `${Environment.inv().api}/wa_issueTypes/optionList/${alias}`,
      {
        params: httpParams
      }
    );
  }

  getTemplates(): Observable<{ templateList: MessageTemplateInterface[], count: number }> {
    return this.http.get<{ templateList: MessageTemplateInterface[], count: number }>(
      `${Environment.inv().api}/manageNewsletter/templatesList`
    );
  }

  getTemplate(id: string): Observable<MessageTemplateInterface[]> {
    return this.http.get<MessageTemplateInterface[]>(
      `${Environment.inv().api}/manageNewsletter/templates/${id}`,
    );
  }

  getRecipientsFile(file64: string | ArrayBuffer): Observable<{found: {userId: string; fullName: string}[]; notFound: {userId: string; errorReason: string}[]}> {
    return this.http.post<{found: {userId: string; fullName: string}[]; notFound: {userId: string; errorReason: string}[]}>(
      `${Environment.inv().api}/manageNewsletter/findRecipients`,
      {file: file64},
    );
  }

  getRecipientsFileForSms(newsletterId: string): Observable<{file: string, extension: string, notFound:{userId: string; fullName: string}[]}> {
    return this.http.post<{file: string, extension: string, notFound:{userId: string; fullName: string}[]}>(
      `${Environment.inv().api}/manageNewsletter/recipientsForSMS`,
      { newsletterId },
    );
  }

  getDownloadReport(
    format: 'pdf' | 'xlsx',
    newsletterId: string
  ): Observable<FileBase64> {
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();

    if (!currentEmployeeId) {
      throw new Error(`Failed to get current employee id from localStorage!`);
    }
    const params = {
      dateBegin: new Date().toISOString(),
      format,
      newsletterId,
    };

    return this.http.post<FileBase64>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/newsletterStatistics`,
      params,
    );
  }

  uploadRecipientsSmsFile(file64: string | ArrayBuffer, newsletterId: string): Observable<{processedCount: number, notMatchedCount: number, message: string, file: string}> {
    return this.http.post<{processedCount: number, notMatchedCount: number, message: string, file: string}>(
      `${Environment.inv().api}/manageNewsletter/uploadSmsResults`,
      {file: file64, newsletterId: newsletterId},
    );
  }
}
