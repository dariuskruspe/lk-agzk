import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OptionListSurveyInterface } from '@app/features/surveys-management/models/surveys-management.interface';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { Environment } from '@shared/classes/ennvironment/environment';
import { FileSignatureInterface } from '@shared/features/signature-file/models/doc-signature.interface';
import { getRole, SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { SignatureResponseInterface } from '@shared/models/signature-response.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocSignService {
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  signDoc(data: {
    files: FileSignatureInterface[];
    forEmployee?: boolean;
    cancel?: boolean;
    comment?: string;
    taskId?: string;
    signInfo?: any;
    currentRole?: SignRoles;
  }): Observable<SignatureResponseInterface> {
    const body: any = {
      files: data.files,
      signInfo: {
        ...data.signInfo,
      },
      employeeId: this.localStorage.getCurrentEmployeeId(),
    };

    if (data.currentRole) {
      body.role = data.currentRole;
    } else {
      body.role = this.getSection() === 'documents-employee'
      ? SignRoles.manager
      : getRole(data.forEmployee, data.taskId);
    };

    if (data.taskId) {
      body.taskId = data.taskId;
    }
    if (data.cancel) {
      body.cancel = true;
      body.comment = data.comment ?? '';
    }
    return this.http.patch<SignatureResponseInterface>(
      `${Environment.inv().api}/wa_global/sign`,
      body
    );
  }

  // HRM-40223 (conflict resolve) -> commit 28fca9925c4114f90230dd9b7c1bd2da516ebcf8
  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }

  getDocument(
    params: GetDocumentParamsInterface
  ): Observable<DocumentInterface> {
    return this.http.get<DocumentInterface>(
      `${
        Environment.inv().api
      }/wa_employee/${this.localStorage.getCurrentEmployeeId()}/documents/${
        params.fileOwner
      }/${params.id}?forEmployee=${!!params?.forEmployee}`
    );
  }

  setDocViewed(
    owner: string,
    documentId: string,
    forEmployee: boolean,
    availableRoles?: SignRoles[],
  ): Observable<string> {
    const body: {forEmployee: boolean; viewed: boolean; role?: SignRoles[]} = {
      viewed: true,
      forEmployee,
    };
    if (availableRoles && availableRoles.length > 0) {
      body.role = availableRoles
    }
    return this.http.patch<string>(
      `${
        Environment.inv().api
      }/wa_employee/${this.localStorage.getCurrentEmployeeId()}/documents/${owner}/${documentId}`,
      body
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
}
