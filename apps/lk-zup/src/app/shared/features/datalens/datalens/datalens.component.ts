import { Component, input } from '@angular/core';
import { DatalensPageComponent } from '@shared/features/datalens/datalens-page/datalens-page.component';
import { TabViewModule } from 'primeng/tabview';
import { DatalensConfig } from '@shared/features/datalens/shared/types';

@Component({
    selector: 'app-datalens',
    imports: [TabViewModule, DatalensPageComponent],
    templateUrl: './datalens.component.html',
    styleUrl: './datalens.component.scss'
})
export class DatalensComponent {
  config = input.required<DatalensConfig>();
}
