import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const STATIC_FILES = [
  {
    fileName: 'sber_9.2.2.11.sav.wnd',
    fileDescription: 'Уведомление из ИФНС',
    fileType: 'doc',
    fileID: '3076942f-6876-11ec-810e-00155d28d802',
    fileLink: '/wa_global/file/issueFile/3076942f-6876-11ec-810e-00155d28d802',
  },
  {
    fileName: 'sber_9.2.2.11.sav.wnd',
    fileDescription: 'Уведомление из ИФНС',
    fileType: 'doc',
    fileID: '3076942f-6876-11ec-810e-00155d28d802',
    fileLink: '/wa_global/file/issueFile/3076942f-6876-11ec-810e-00155d28d802',
  },
];

const STATIC_FILES_TYPE = {
  type: 'static-files',
  formControlName: 'static-files',
  label: 'Файлы для скачивания',
  files: STATIC_FILES,
  gridClasses: ['col-md-12'],
  disabled: false,
  edited: true,
  validations: [],
};

@Injectable()
export class MockStaticFormFilesInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((response: HttpResponse<any>) => {
        if (
          response.body?.template &&
          response.body?.template instanceof Array
        ) {
          response.body.template.push(STATIC_FILES_TYPE);
        }
        return response;
      })
    );
  }
}
