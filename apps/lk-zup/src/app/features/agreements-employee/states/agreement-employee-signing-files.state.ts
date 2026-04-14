import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeSigningFilesState {
  public entityName = 'agreementEmployeeSigningFiles';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.signFiles,
    },
  };

  constructor(private agreementsEmployeeService: AgreementsEmployeeService) {}

  signFiles(data: {
    files: { fileID: string; owner: string; signInfo: { sig: string } }[];
    signInfo: { provider: string };
  }): Observable<{ signingData: { fileID: string; errorMsg: string }[] }> {
    return this.agreementsEmployeeService.signFiles(data);
  }
}
