import { HttpParams } from '@angular/common/http';

export function convertToParams(
  params: Record<string, string | number | boolean>
): HttpParams {
  let httpParams = new HttpParams();
  for (const key of Object.keys(params)) {
    httpParams = httpParams.append(key, params[key]);
  }
  return httpParams;
}
