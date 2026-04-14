import { Observable } from 'rxjs';

export interface AsyncBreadcrumbInterface {
  getLabel$(): Observable<string>;
}
