import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WindowService } from '@shared/services/window.service';

@Component({
  selector: 'app-team-full',
  standalone: true,
  imports: [],
  templateUrl: './team-full.component.html',
  styleUrl: './team-full.component.scss',
})
export class TeamFullComponent {
  sanitizer = inject(DomSanitizer);
  window = inject(WindowService);

  url = signal(
    this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://datalens.yandex/zioul90fvxnom?tab=l9&state=4466822b135?organizatsiya_spgw=&_embedded=1&_no_controls=1',
    ),
  );

  height = computed(() => {
    const h = this.window.pageContentHeight();
    return h + 'px';
  });
}
