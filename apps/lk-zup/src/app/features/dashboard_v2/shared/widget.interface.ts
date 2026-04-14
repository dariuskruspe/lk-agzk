import { Observable } from 'rxjs';

export interface IWidgetComponent {
  loading$: Observable<boolean>;
}
