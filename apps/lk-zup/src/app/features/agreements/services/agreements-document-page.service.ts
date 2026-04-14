import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DocumentFilterInterface } from '../models/agreement.interface';
import {
  AgreementDocumentPageReqInterface,
  DocumentInterface,
} from '../models/document.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsDocumentPageService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getDocumentPage(
    data: AgreementDocumentPageReqInterface
  ): Observable<DocumentInterface> {
    return this.http.get<DocumentInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/documents/${data.fileOwner}/${
        data.id
      }?forEmployee=${!!data?.forEmployee}`
    );
  }

  signDocument(
    data: AgreementDocumentPageReqInterface,
    additionalParams: DocumentFilterInterface
  ): Observable<DocumentInterface> {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    return this.http.patch<DocumentInterface>(
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
