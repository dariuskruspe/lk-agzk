import { Provider } from '@angular/core';
import { desktopProviders } from './desktop/destop.providers';
import { mobileProviders } from './mobile/destop.providers';

export function resolvePlatformProviders(isDesktop: boolean): Provider[] {
  return isDesktop ? desktopProviders : mobileProviders;
}
