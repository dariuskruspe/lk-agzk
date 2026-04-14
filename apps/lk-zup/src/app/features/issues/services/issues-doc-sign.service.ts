import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { SignatureInfoInterface } from '../../../shared/features/signature-validation-form/models/signature-info.interface';
import { FileOwners } from '../../../shared/models/files.interface';
import { IssuesDocSignInterface } from '../models/issues-doc-sign.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesDocSignService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getDocSignList(issueID: string): Observable<IssuesDocSignInterface[]> {
    return this.http.get<IssuesDocSignInterface[]>(
      `${Environment.inv().api}/wa_issues/${issueID}/documents`
    );
  }

  signDoc(data: {
    fileID: string;
    fileOwner: FileOwners;
    signInfo: SignatureInfoInterface;
  }): Observable<{ success: boolean }> {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    return this.http.patch<{ success: boolean }>(
      `${Environment.inv().api}/wa_global/sign/${data.fileOwner}/${
        data.fileID
      }`,
      {
        signInfo: data.signInfo,
        employeeId: currentEmployeeId,
      }
    );
  }
}
