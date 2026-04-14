import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

export const DashboardV2Guard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  const useOldDashboard = localStorageService.getUseOldDashboard();
  if (useOldDashboard) {
    const dashboardOldPath = router.parseUrl('/dashboard_old');
    return new RedirectCommand(dashboardOldPath, {
      skipLocationChange: true,
    });
  }

  return true;
};

export const DashboardOldGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const useOldDashboard = localStorageService.getUseOldDashboard();
  if (!useOldDashboard) {
    const dashboardV2Path = router.parseUrl('/');
    return new RedirectCommand(dashboardV2Path, {
      skipLocationChange: true,
    });
  }
  return true;
};
