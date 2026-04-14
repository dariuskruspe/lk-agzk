import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { IssueApproveInterfaceSuccess } from '../../models/issue-approve.interface';
import { IssuesEmailApprovalInterface } from '../../models/issues-email-approval.interface';

@Component({
    selector: 'app-issues-email-approval',
    templateUrl: './issues-email-approval.component.html',
    styleUrls: ['./issues-email-approval.component.scss'],
    standalone: false
})
export class IssuesEmailApprovalComponent {
  @Output() approve: EventEmitter<any> = new EventEmitter<any>();

  @Output() reject: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Обработана ли (согласована или отклонена) задача по согласованию заявки пользователем.
   */
  @Input() isTaskProcessed: boolean = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`
      )
    );
  }

  @Input() approveData:
    | IssuesEmailApprovalInterface
    | IssueApproveInterfaceSuccess;

  @Input() loading: WritableSignal<boolean>;

  @Input() isApprove: boolean;

  @Input() settings!: SettingsInterface;

  comment: string;

  /**
   * Обработчик нажатия кнопки "Согласовать".
   */
  onApprove(): void {
    this.approve.emit({
      comment: this.comment,
    });
    this.isTaskProcessed = true;
  }

  /**
   * Обработчик нажатия кнопки "Отклонить".
   */
  onReject(): void {
    this.reject.emit({
      comment: this.comment,
    });
    this.isTaskProcessed = true;
  }

  checkState(approveDataSuccess: IssueApproveInterfaceSuccess): number {
    if (
      approveDataSuccess?.message?.text?.toLowerCase().includes('отклон') ||
      approveDataSuccess?.message?.text?.toLowerCase().includes('reject')
    ) {
      return 2;
    } else if (
      approveDataSuccess?.message?.text?.toLowerCase().includes('согласован') ||
      approveDataSuccess?.message?.text?.toLowerCase().includes('approve')
    ) {
      return 1;
    }
    return 0;
  }
}
