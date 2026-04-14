import { Observable } from 'rxjs';
import { NumbersRange } from '../../../shared/models/number-range.type';

export interface MainBreadcrumbsInterface {
  label: Observable<string>;
  url: string;
  depth: NumbersRange<0, 4>;
  bcLinkDisable?: boolean;
}

export interface CachedBreadcrumbsInterface {
  label: string;
  url: string;
  depth: NumbersRange<0, 4>;
}
