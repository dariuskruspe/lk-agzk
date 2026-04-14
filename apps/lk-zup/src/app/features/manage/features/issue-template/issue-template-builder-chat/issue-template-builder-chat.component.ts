import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { IssueTemplateAiService } from '../shared/issue-template-ai.service';
import { IssueTemplateRepository } from '../shared/issue-template-repository';
import { TrustedHtmlModule } from '@app/shared/pipes/security/trusted-html.module';

@Component({
    selector: 'app-issue-template-builder-chat',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ChipModule,
        TooltipModule,
        TrustedHtmlModule,
    ],
    templateUrl: './issue-template-builder-chat.component.html',
    styleUrl: './issue-template-builder-chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueTemplateBuilderChatComponent implements AfterViewChecked {
  private issueTemplateAiService = inject(IssueTemplateAiService);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  rep = input.required<IssueTemplateRepository>();

  loading = signal(false);
  error = signal<string | null>(null);
  messages = signal<IssueTemplateAiMessage[]>([]);
  currentMessage = signal('');
  sessionId = signal(uuidv4());

  private shouldScrollToBottom = false;

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(message: string) {
    if (this.loading() || !message.trim()) {
      return;
    }

    // Добавляем пользовательское сообщение
    this.messages.update((messages) => [
      ...messages,
      { role: 'user', content: message.trim() },
    ]);

    this.loading.set(true);
    this.error.set(null);
    this.currentMessage.set('');
    this.shouldScrollToBottom = true;

    const currentFormJson = JSON.stringify(this.rep().value().template);

    this.issueTemplateAiService
      .generateIssueTemplate({
        message: message.trim(),
        current_form_json: currentFormJson,
        session_id: this.sessionId(),
      })
      .subscribe({
        next: (response) => {
          this.messages.update((messages) => [
            ...messages,
            {
              role: 'assistant',
              json: response.result.json,
              changes: response.result.changes,
            },
          ]);
          this.rep().updateTemplateFromJson(JSON.parse(response.result.json));
          this.loading.set(false);
          this.shouldScrollToBottom = true;
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(
            error?.message || 'Произошла ошибка при обработке запроса',
          );
        },
      });
  }

  onSubmit() {
    this.sendMessage(this.currentMessage());
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}

type IssueTemplateAiMessage =
  | IssueTemplateAiMessageUser
  | IssueTemplateAiMessageAssistant;

type IssueTemplateAiMessageUser = { role: 'user'; content: string };

type IssueTemplateAiMessageAssistant = {
  role: 'assistant';
  json: string;
  changes: string;
};
