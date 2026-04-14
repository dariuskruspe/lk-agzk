import { Component, inject, WritableSignal } from '@angular/core';
import { IssuesInterface } from '@features/issues/models/issues.interface';
import { IssuesService } from '@features/issues/services/issues.service';
import { IssuesState } from '@features/issues/states/issues.state';
import { logError } from '@shared/utilits/logger';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-issues-crossing-dialog',
    templateUrl: './issues-crossing-dialog.component.html',
    styleUrls: ['./issues-crossing-dialog.component.scss'],
    standalone: false
})
export class IssuesCrossingDialogComponent {
  issuesService: IssuesService = inject(IssuesService);

  issuesState: IssuesState = inject(IssuesState);

  crossingInfo: {
    block: true;
    periodCrossingData: { text: string; issueID: string }[];
  };

  loading: WritableSignal<boolean> = this.issuesService.loading;

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.crossingInfo = this.config.data;
  }

  toUrl(url: string): void {
    window.open(`/issues/list/${url}`, '_blank');
  }

  close(): void {
    this.ref.close();
  }

  async anywayCreateIssue(): Promise<void> {
    this.issuesService.loading.set(true);
    let issueFromServer: IssuesInterface;
    try {
      issueFromServer = await firstValueFrom(
        this.issuesService.addIssue({
          ...this.issuesState.issueBodyCopy,
          createWithoutPeriodsCheck: true,
        })
      );
    } catch (e) {
      logError(e);
    } finally {
      this.issuesService.loading.set(false);
      this.close();
    }

    if (issueFromServer) {
      this.issuesService.loading.set(false);
      this.issuesState.addSuccess(issueFromServer);
    }
  }
}
