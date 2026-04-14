import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { DockyMessage, DockyMessageToolCall } from '../../shared/types';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-docky-message-issue-created',
  imports: [Button],
  template: `
    <div class="issue-message" [class]="messageClass()">
      <div class="issue-content">
        <div class="issue-header">
          <i class="pi pi-file-check"></i>
          <span class="issue-text">Заявка №{{ issueNumber() }} создана</span>

          @if (needToSign()) {
            <div class="signature-indicator">
              <i class="pi pi-verified"></i>
            </div>
          }
        </div>

        <a [href]="link()" target="_blank" class="issue-link">
          <p-button
            [label]="buttonLabel()"
            icon="pi pi-external-link"
            [styleClass]="buttonClass()"
            size="small"
          >
          </p-button>
        </a>
      </div>
    </div>
  `,
  styleUrl: './docky-message-issue-created.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockyMessageIssueCreatedComponent {
  payload = input<{
    IssueID: string;
    number: string;
    signatureEnable: boolean;
  }>();

  issueID = computed(() => this.payload().IssueID);
  issueNumber = computed(() => this.payload().number);

  needToSign = computed(() => this.payload()?.signatureEnable === true);

  link = computed(() => ['/issues/list/', this.issueID()].join(''));

  messageClass = computed(() =>
    this.needToSign() ? 'need-signature' : 'default',
  );

  buttonLabel = computed(() => (this.needToSign() ? 'Подписать' : 'Открыть'));

  buttonClass = computed(() =>
    this.needToSign()
      ? 'p-button-warning p-button-sm'
      : 'p-button-outlined p-button-sm',
  );
}
