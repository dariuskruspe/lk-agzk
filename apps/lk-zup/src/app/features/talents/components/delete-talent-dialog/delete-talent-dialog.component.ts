import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { TalentsService } from '@features/talents/sevices/talents.service';
import { IssuesTypesTemplateInterface } from '@features/issues/models/issues-types.interface';

@Component({
    selector: 'app-delete-talent-dialog',
    templateUrl: './delete-talent-dialog.component.html',
    styleUrls: ['./delete-talent-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DeleteTalentDialogComponent implements OnInit {
  info: {
    employeeId: string;
    userId: string;
    talentId: string;
    issueEmployee: string;
  };

  comment: string;

  isLoadingSignal: WritableSignal<boolean> = signal(true);

  issueType: IssuesTypesTemplateInterface;

  constructor(
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private talentsService: TalentsService,
  ) {
    this.info = this.config.data;
  }

  ngOnInit() {
    this.getIssueTypeByAlias().then(() => {
      this.isLoadingSignal.set(false);
    });
  }

  close(result?: boolean): void {
    this.ref.close(result);
  }

  async getIssueTypeByAlias(): Promise<void> {
    this.issueType = await firstValueFrom(
      this.talentsService.getIssuesTypeAlias('talentDelete'),
    );
  }

  async sendIssue(): Promise<void> {
    this.isLoadingSignal.set(true);
    const issueData = {
      talent: this.info.talentId,
      employeeID: this.info.employeeId,
      userID: this.info.userId,
      // isOrder: false,
      issueEmployee: this.info.issueEmployee,
      issueTypeID: this.issueType.issueTypeID,
      description: this.comment,
    };
    await firstValueFrom(
      this.talentsService.createIssueRemoveTalent(issueData),
    );
    this.close(true);
  }

  cancelIssue(): void {
    this.close();
  }
}
