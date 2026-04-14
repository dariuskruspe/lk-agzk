import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  AgreementEmployeeDocumentPageInterface,
  AgreementEmployeeDocumentPageReqInterface,
} from '../models/agreement-employee-document-page.interface';
import { AgreementEmployeeFilterInterface } from '../models/agreement-employee.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeDocumentPageService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getDocumentPage(
    data: AgreementEmployeeDocumentPageReqInterface
  ): Observable<AgreementEmployeeDocumentPageInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('forEmployee', !!data?.forEmployee);
    httpParams = httpParams.append('role', SignRoles.manager);
    return this.http.get<AgreementEmployeeDocumentPageInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/documents/${data.fileOwner}/${data.id}`,
      { params: httpParams }
    );
  }

  signDocument(
    data: AgreementEmployeeDocumentPageReqInterface,
    additionalParams: AgreementEmployeeFilterInterface
  ): Observable<AgreementEmployeeDocumentPageInterface> {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    return this.http.patch<AgreementEmployeeDocumentPageInterface>(
      `${Environment.inv().api}/wa_global/sign/${data.fileOwner}/${
        data.fileID
      }`,
      {
        ...additionalParams,
        signInfo: data.signInfo,
        taskId: data.taskId,
        employeeId: currentEmployeeId,
      }
    );
  }
}
