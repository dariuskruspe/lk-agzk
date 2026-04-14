import { Component, Inject } from '@angular/core';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';

@Component({
    selector: 'app-support-empty-page-container',
    templateUrl: './support-empty-page-container.component.html',
    styleUrls: ['./support-empty-page-container.component.scss'],
    providers: [provideBreadcrumb('SUPPORT_EMPTY_PAGE', 1)],
    standalone: false
})
export class SupportEmptyPageContainerComponent {
  constructor(@Inject(BREADCRUMB) private _: unknown) {}
}
