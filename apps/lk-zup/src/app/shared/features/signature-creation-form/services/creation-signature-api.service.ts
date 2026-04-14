import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { SignatureResponseInterface } from '../../../models/signature-response.interface';
import { CreatingSmsInterface } from '../models/creating-sms.interface';
import { CreationSignatureFormInterface } from '../models/creation-signature-form.interface';

@Injectable({
  providedIn: 'root',
})
export class CreationSignatureApiService {
  constructor(private http: HttpClient) {}

  createSignature(
    data: CreationSignatureFormInterface
  ): Observable<SignatureResponseInterface> {
    return this.http.post<SignatureResponseInterface>(
      `${Environment.inv().api}/wa_users/certificates`,
      data
    );
  }

  sendConfirmCode(data: CreatingSmsInterface): Observable<void> {
    return this.http.post<void>(
      `${Environment.inv().api}/wa_global/confirmationCode`,
      data
    );
  }
}
