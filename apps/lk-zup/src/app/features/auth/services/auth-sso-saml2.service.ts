import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { AuthTokenInterface } from '../models/auth-login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthSsoSaml2Service {
  constructor(public http: HttpClient) {}

  authnRequest(issuerUrl: string): Observable<unknown> {
    let httpParams = new HttpParams();
    if (issuerUrl) {
      httpParams = httpParams.append('issuerUrl', issuerUrl);
    }

    return this.http.get(`${Environment.inv().api}/wa_users/sso/authnRequest`, {
      params: httpParams,
    });
  }

  logout(id: string): Observable<void> {
    return this.http.post<void>(
      `${Environment.inv().api}/wa_users/sso/logoutRequest`,
      {
        userID: id,
      }
    );
  }

  ssoRedirect(params: AuthTokenInterface, method?: 'POST' | 'GET'): void {
    const modParams = params;
    let queryParam = '';
    let ssoLocation;
    let i = 0;
    if (modParams?.location) {
      ssoLocation = modParams.location;
      delete modParams.location;
    }
    for (const key of Object.keys(modParams)) {
      const separator = i ? '&' : '?';
      queryParam += `${separator + key}=${modParams[key]}`;
      i += 1;
    }
    if (ssoLocation) {
      if (!method || method === 'GET') {
        window.location.href = ssoLocation + queryParam;
      } else {
        this.postForm(ssoLocation);
      }
    }
  }

  postForm(path: string): void {
    const url = new URL(path);
    const search = url.search.split('?').pop();
    const params = JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === '' ? value : decodeURIComponent(value);
      }
    );

    const method = 'post';

    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', url.origin + url.pathname);

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }
}
