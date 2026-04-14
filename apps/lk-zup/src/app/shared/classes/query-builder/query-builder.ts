import { HttpParams } from '@angular/common/http';

export class QueryBuilder {
  static queryBuilder(filter: unknown): HttpParams {
    let httpParams = new HttpParams();
    if (filter) {
      for (const key of Object.keys(filter)) {
        if (Array.isArray(filter[key]) ? filter[key].length : filter[key]) {
          httpParams = httpParams.append(key, filter[key]);
        }
      }
    }
    return httpParams;
  }
}
