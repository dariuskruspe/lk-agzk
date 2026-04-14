import { Observable } from 'rxjs';

export interface ReportInterface {
  getFile(params: Record<string, unknown>): void;
  getData(): unknown;
  getData$(): Observable<unknown>;
  loading$(): Observable<boolean>;
  forcedLoading$: Observable<boolean>;
  onInit(cb: (v: unknown) => void): void;
}
