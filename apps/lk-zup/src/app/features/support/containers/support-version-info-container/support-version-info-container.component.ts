import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import ChangeLog from '../../../../../version/change-log.json';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';

// declare let require: any;
@Component({
    selector: 'app-support-version-info-container',
    templateUrl: './support-version-info-container.component.html',
    styleUrls: ['./support-version-info-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('UPDATE_INFORMATION', 1)],
    standalone: false
})
export class SupportVersionInfoContainerComponent {
  changeLog = ChangeLog;

  releaseFile: any;

  constructor(
    private http: HttpClient,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  getNodeFile(version: string): any {
    this.http
      .get(`./version/release-notes/${version}.md`, {
        responseType: 'text',
      })
      .subscribe((a) => {
        this.releaseFile = a;
      });
  }
}
