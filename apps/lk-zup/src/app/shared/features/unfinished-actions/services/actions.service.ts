import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../classes/ennvironment/environment';
import { ConfirmBodyInterface } from '../models/confirm.interface';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(private httpClient: HttpClient) {}

  sendConfirmCode(data: ConfirmBodyInterface): Observable<void> {
    return this.httpClient.post<void>(
      `${Environment.inv().api}/wa_global/confirmationCode`,
      data
    );
  }
}
