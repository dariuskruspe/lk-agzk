import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  DatalensPageConfig,
  DatalensWidgetConfig,
} from '@shared/features/datalens/shared/types';

@Component({
    selector: 'app-datalens-page',
    imports: [],
    templateUrl: './datalens-page.component.html',
    styleUrl: './datalens-page.component.scss'
})
export class DatalensPageComponent {
  private sanitizer = inject(DomSanitizer);

  config = input.required<DatalensPageConfig>();

  items = computed(() => {
    const { rows: groups } = this.config();

    const rowSize = 200;

    return groups.map((rows) => {
      const maxRowSize = Math.max(...rows.map((i) => i.rows));

      return {
        height: rowSize * maxRowSize,
        rows: rows.map((row) => ({
          ...row,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(
            row.url + '?_embedded=1&_no_controls=1&_theme=light',
          ),
        })),
      };
    });
  });
}
