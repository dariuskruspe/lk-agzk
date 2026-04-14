import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FileOwners } from '@app/shared/models/files.interface';
import {
  AgreementFileInterface,
  AgreementInterface,
  DocumentFilterInterface,
  DocumentListInterface,
  DocumentTypesInterface,
} from '@features/agreements/models/agreement.interface';
import { AgreementsResponse } from '@features/agreements/models/agreements-response.interface';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@features/agreements/models/document.interface';
import { Environment } from '@shared/classes/ennvironment/environment';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentsListResource } from '../resources/documents-list.resource';
import { injectResource } from '@app/shared/services/api-resource';

@Injectable({
  providedIn: 'root',
})
export class DocumentApiService {
  private documentsListResource = injectResource(DocumentsListResource);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  getDocument(
    params: GetDocumentParamsInterface,
  ): Observable<DocumentInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('forEmployee', !!params?.forEmployee);
    httpParams = httpParams.append('role', params.role);
    if (!params.currentEmployeeId)
      params.currentEmployeeId =
        this.localStorageService.getCurrentEmployeeId();

    if (this.getSection() === 'documents-employee') {
      params.role = SignRoles.manager;
    }

    return this.http.get<DocumentInterface>(
      `${Environment.inv().api}/wa_employee/${
        params.currentEmployeeId
      }/documents/${params.fileOwner}/${params.id}`,
      { params: httpParams },
    );
  }

  getDocumentList(params: {
    currentEmployeeId: string;
    filterData?: DocumentFilterInterface;
  }): Observable<DocumentListInterface> {
    return this.documentsListResource.asObservable(
      params.currentEmployeeId,
      params.filterData,
    );
  }

  getSignedAgreementsList(
    employeeId: string,
  ): Observable<AgreementInterface[]> {
    return this.http
      .get<AgreementsResponse>(
        `${Environment.inv().api}/wa_employee/${employeeId}/agreements`,
        {
          params: { signed: true },
        },
      )
      .pipe(map((res) => res.agreements));
  }

  getUnsignedAgreementsList(data: {
    currentEmployeeId: string;
    docUnsignedStates: string[];
  }): Observable<DocumentListInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('block', true);
    httpParams = httpParams.append('role', SignRoles.employee);
    // httpParams = httpParams.append('state', data.docUnsignedStates.join(','));
    return this.http.get<DocumentListInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/documents?forEmployee=true`,
      {
        params: httpParams,
      },
    );
  }

  getAgreementImgReport(filePath: string): Observable<string> {
    return this.http.get<string>(`${Environment.inv().api}/${filePath}/base64`);
  }

  signAgreement(
    currentEmployeeId: string,
    agreementId: string,
  ): Observable<AgreementInterface> {
    return this.http.patch<AgreementInterface>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/agreements/${agreementId}`,
      {},
    );
  }

  getAgreementsIssueFilesList(
    ids: string[],
    owner: FileOwners,
  ): Observable<AgreementFileInterface[]> {
    return this.http.get<AgreementFileInterface[]>(
      `${Environment.inv().api}/wa_global/files/${owner}/base64`,
      {
        params: { ids: ids.join(','), forSign: true },
      },
    );
  }
  getAgreementsAgreementFilesList(ids: string[]): Observable<AgreementFileInterface[]> {
    return this.http.get<AgreementFileInterface[]>(
      `${Environment.inv().api}/wa_global/files/agreement/base64`,
      {
        params: { ids: ids.join(','), forSign: true },
      },
    );
  }

  signFiles(data: {
    files: { fileID: string; owner: string; signInfo: { sig: string } }[];
    signInfo: { provider: string };
  }): Observable<{ signingData: { fileID: string; errorMsg: string }[] }> {
    const section = this.getSection();
    let role: SignRoles;
    switch (section) {
      case 'documents':
        role = SignRoles.org;
        break;
      case 'documents-employee':
      case 'issues-management':
        role = SignRoles.manager;
        break;
      default:
        role = SignRoles.employee;
    }
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId()
    const body = {
      role,
      employeeId: currentEmployeeId,
      files: data.files,
      signInfo: {
        ...data.signInfo,
        employeeId: currentEmployeeId,
      },
    };
    return this.http.patch<{
      signingData: { fileID: string; errorMsg: string }[];
    }>(`${Environment.inv().api}/wa_global/sign`, body);
  }

  getDocumentTypes(): Observable<DocumentTypesInterface> {
    return this.http.get<DocumentTypesInterface>(
      `${Environment.inv().api}/wa_documentsTypes`,
    );
  }

  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }
}
