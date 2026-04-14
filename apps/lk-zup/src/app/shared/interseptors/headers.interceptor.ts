import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthLoginService } from '../../features/auth/services/auth-login.service';
import { HttpRequestInterface } from '../models/http-request.interface';
import { LocalStorageService } from '../services/local-storage.service';

// import Version from '../../../version/version.json';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  // private ver = Version;

  constructor(
    private authService: AuthLoginService,
    private localstorageService: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<HttpRequestInterface>,
    next: HttpHandler
  ): Observable<HttpEvent<HttpRequestInterface>> {
    let httpReq = req;
    if (this.localstorageService.getTokens()) {
      httpReq = httpReq.clone({
        setHeaders: {
          'X-Token': `${this.localstorageService.getTokens()}`,
        },
      });
    }
    if (this.localstorageService.getCurrentEmployeeId()) {
      httpReq = httpReq.clone({
        setHeaders: {
          'Employee-Id': this.localstorageService.getCurrentEmployeeId(),
        },
      });
    }

    // skuzminov: закомментил установку заголовка Content-Type в захардкоженное значение
    // 'application/json; charset=utf-8', т. к. запрос вполне себе может содержать другой тип контента, например
    // 'image/png' при загрузке аватарки пользователя на сервер методом /{lang}/wa_employee/{employeeID}/image
    // httpReq = httpReq.clone({
    //   setHeaders: {
    //     'Content-Type': `application/json; charset=utf-8`,
    //   },
    // });

    // if (
    //   this.localstorageService.getVersion() !==
    //   `${this.ver.version}-${this.ver.type}`
    // ) {
    //   httpReq = httpReq.clone({
    //     setHeaders: {
    //       'Clear-Site-Data': `"cache", "cookies", "executionContents"`,
    //     },
    //   });
    // }
    return next.handle(httpReq);
  }
}
