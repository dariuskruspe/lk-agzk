import { Component, inject, signal, computed, effect } from '@angular/core';
import { DatalensPageComponent } from '@shared/features/datalens/datalens-page/datalens-page.component';
import { DatalensComponent } from '@shared/features/datalens/datalens/datalens.component';

import { MyTeamService } from '../shared/my-team.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WindowService } from '@app/shared/services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/shared/services/app.service';

@Component({
    selector: 'app-my-team',
    imports: [DatalensPageComponent, DatalensComponent],
    templateUrl: './my-team.component.html',
    styleUrl: './my-team.component.scss'
})
export class MyTeamComponent {
  window = inject(WindowService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  app = inject(AppService);

  myTeamService = inject(MyTeamService);

  height = computed(() => {
    const h = this.window.pageContentHeight();
    return h + 'px';
  });

  constructor() {
    effect(() => {
      const mode = this.myTeamService.mode();
      if (!mode) {
        return;
      }

      const route = this.route.snapshot;
      if (route.children.length === 0) {
        this.router.navigate([mode], {
          replaceUrl: true,
          relativeTo: this.route,
        });
      }
    });
  }

  ngOnInit() {
    this.myTeamService.init();
  }
}
