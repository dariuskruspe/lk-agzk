import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  AgreementEmployeeDocumentTypesInterface,
  AgreementEmployeeFileInterface,
  AgreementEmployeeFilterInterface,
  AgreementsEmployeeInterface,
} from '../models/agreement-employee.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getAgreementsEmployeeLists(params: {
    currentEmployeeId: string;
    filterData?: AgreementEmployeeFilterInterface;
  }): Observable<AgreementsEmployeeInterface> {
    let httpParams = new HttpParams();
    if (params.filterData) {
      for (const key of Object.keys(params.filterData)) {
        if (
          Array.isArray(params.filterData[key])
            ? params.filterData[key].length
            : params.filterData[key]
        ) {
          httpParams = httpParams.append(key, params.filterData[key]);
        }
      }
      // httpParams = httpParams.append('role', SignRoles.manager);
    }
    return this.http.get<AgreementsEmployeeInterface>(
      `${Environment.inv().api}/wa_employee/${
        params.currentEmployeeId
      }/documents`,
      { params: httpParams }
    );
  }

  getUnsignedAgreementsEmployeeList(data: {
    currentEmployeeId: string;
    docUnsignedStates: string[];
  }): Observable<AgreementsEmployeeInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('mandatory', true);
    httpParams = httpParams.append('role', SignRoles.manager);
    httpParams = httpParams.append('state', data.docUnsignedStates.join(','));
    return this.http.get<AgreementsEmployeeInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/documents`,
      {
        params: httpParams,
      }
    );
  }

  getAgreementsEmployeeFilesList(
    ids: string[]
  ): Observable<AgreementEmployeeFileInterface[]> {
    return this.http.get<AgreementEmployeeFileInterface[]>(
      `${Environment.inv().api}/wa_global/files/issue/base64`,
      {
        params: { ids: ids.join(','), forSign: true },
      }
    );
  }

  signFiles(data: {
    files: { fileID: string; owner: string; signInfo: { sig: string } }[];
    signInfo: { provider: string };
  }): Observable<{ signingData: { fileID: string; errorMsg: string }[] }> {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    const body = {
      role: SignRoles.manager,
      files: data.files,
      signInfo: {
        ...data.signInfo,
      },
      employeeId: currentEmployeeId,
    };
    return this.http.patch<{
      signingData: { fileID: string; errorMsg: string }[];
    }>(`${Environment.inv().api}/wa_global/sign`, body);
  }

  getDocumentTypes(): Observable<AgreementEmployeeDocumentTypesInterface> {
    return this.http.get<AgreementEmployeeDocumentTypesInterface>(
      `${Environment.inv().api}/wa_documentsTypes`
    );
  }
}
