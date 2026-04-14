import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

const HR_ROUTE = ['/hr-presentation'];

@Injectable({ providedIn: 'root' })
export class HrPortalBridgeService {
  private router = inject(Router);

  startReviewPresentation(presentationId: number) {
    this.router.navigate(HR_ROUTE, {
      queryParams: { action: 'review', presentationId },
    });
  }

  open() {
    this.router.navigate(HR_ROUTE);
  }
}
