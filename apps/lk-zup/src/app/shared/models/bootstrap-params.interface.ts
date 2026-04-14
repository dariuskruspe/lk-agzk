import { InjectionToken } from '@angular/core';

export const BOOTSTRAP_PARAMS = new InjectionToken<BootstrapParamsInterface>(
  'Bootstrap params'
);

export interface BootstrapParamsInterface {
  authLink?: string;
  demo?: boolean;
  quit?: () => void;
}
