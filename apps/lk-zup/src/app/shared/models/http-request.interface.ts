import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpRequestInterface {
  body: null;
  context: HttpContext;
  headers: HttpHeaders;
  method: string;
  params: HttpParams;
  reportProgress: boolean;
  responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
  url: string;
  urlWithParams: string;
  withCredentials: boolean;
}
