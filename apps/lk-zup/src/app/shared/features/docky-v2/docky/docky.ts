import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ElementRef,
  signal,
  viewChild,
  inject,
  ApplicationRef,
  Injector,
  ViewContainerRef,
  TemplateRef,
  OnDestroy,
  effect,
  computed,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { LiquidContainerComponent } from '../../liquid/liquid-container.component';
import {
  LucideAngularModule,
  SendIcon,
  Trash2Icon,
  MessageCircleXIcon,
  XIcon,
  MessageCirclePlus,
  MessageCirclePlusIcon,
} from 'lucide-angular';
import { LangModule } from '../../lang/lang.module';
import {
  DockyMessage,
  DockyMessageAgent,
  DockyMessageHuman,
  DockyMessageSystem,
} from '../shared/types';
import { DockyChat } from './docky-chat/docky-chat';
import { DockyChatInput } from './docky-chat-input/docky-chat-input';
import { DockyBot } from '../shared/docky-bot';
import {
  SSEConnectionError,
  SSERequestError,
  SSEStreamProtocolError,
} from '@app/shared/utilits/sse-client';
import { TooltipModule } from 'primeng/tooltip';
import { DockyService } from '../shared/docky.service';

@Component({
  selector: 'app-docky',
  imports: [
    LiquidContainerComponent,
    LucideAngularModule,
    LangModule,
    DockyChat,
    DockyChatInput,
    TooltipModule,
  ],
  templateUrl: './docky.html',
  styleUrl: './docky.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '280ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(
          '220ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0 }),
        ),
      ]),
    ]),
    trigger('chatPanelAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-50%) translateY(30px) scale(0.9)',
        }),
        animate(
          '580ms cubic-bezier(0.16, 1, 0.3, 1)',
          keyframes([
            style({
              opacity: 0,
              transform: 'translateX(-50%) translateY(30px) scale(0.9)',
              offset: 0,
            }),
            style({
              opacity: 1,
              transform: 'translateX(-50%) translateY(-4px) scale(1.02)',
              offset: 0.55,
            }),
            style({
              opacity: 1,
              transform: 'translateX(-50%) translateY(1px) scale(0.996)',
              offset: 0.82,
            }),
            style({
              opacity: 1,
              transform: 'translateX(-50%) translateY(0) scale(1)',
              offset: 1,
            }),
          ]),
        ),
      ]),
      transition(':leave', [
        animate(
          '260ms cubic-bezier(0.4, 0, 1, 1)',
          style({
            opacity: 0,
            transform: 'translateX(-50%) translateY(16px) scale(0.97)',
          }),
        ),
      ]),
    ]),
  ],
})
export class Docky implements OnDestroy {
  readonly SendIcon = SendIcon;
  readonly ClearIcon = Trash2Icon;
  readonly MessageCirclePlusIcon = MessageCirclePlusIcon;
  readonly XIcon = XIcon;

  chatInputRef = viewChild(DockyChatInput);
  chatTemplate = viewChild<TemplateRef<unknown>>('chatTemplate');
  messagesViewportRef =
    viewChild<ElementRef<HTMLDivElement>>('messagesViewport');

  isOpen = signal(false);
  isStreaming = signal(false);
  messages = signal<DockyMessage[]>([]);

  isThinking = computed(() => {
    const messages = this.messages();
    // стрим активный, но нет ничего в pending
    return (
      this.isStreaming() &&
      messages.every((message) => {
        if (message.type === 'agent') {
          return !message.pending || message.text.length === 0;
        }

        if (message.type === 'tool_call') {
          return !message.pending;
        }

        return true;
      })
    );
  });

  private readonly dockyService = inject(DockyService);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly document = inject(DOCUMENT);
  // private readonly bot = new DockyBotMock();
  private readonly bot = new DockyBot();

  private portalOutlet: DomPortalOutlet | null = null;
  private messageCounter = 0;

  private abortController = new AbortController();

  constructor() {
    effect(() => {
      if (this.messages().length > 0) {
        this.scrollMessagesToBottom();
      }
    });
  }

  openChat(): void {
    if (this.isOpen()) return;

    const template = this.chatTemplate();
    if (!template) return;

    this.portalOutlet = new DomPortalOutlet(
      this.document.body,
      undefined,
      this.appRef,
      this.injector,
    );

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.portalOutlet.attach(portal);

    this.isOpen.set(true);
    this.document.body.style.overflow = 'hidden';
    this.focusChatInput();
    if (this.messages().length > 0) {
      this.scrollMessagesToBottom();
    }
  }

  closeChat(): void {
    if (!this.isOpen()) return;

    this.onStopStream();

    this.isOpen.set(false);
    this.document.body.style.overflow = '';

    setTimeout(() => {
      this.portalOutlet?.detach();
      this.portalOutlet = null;
    }, 400);
  }

  onOverlayClick(): void {
    this.closeChat();
  }

  onEscape(): void {
    this.closeChat();
  }

  onExampleClick(example: string): void {
    this.onMessageSend(example);
  }

  onClearChat(): void {
    if (this.isStreaming()) return;

    this.messages.set([]);
    this.bot.resetSession();

    setTimeout(() => {
      this.focusChatInput();
    });
  }

  async onMessageSend(message: string) {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) return;

    const history = this.resolvePendingMessages(
      this.messages(),
      'Ответ прерван новым запросом.',
    );
    const nextHistory = [
      ...history,
      this.createHumanMessage(normalizedMessage),
    ];

    this.messages.set(nextHistory);
    this.abortController.abort();
    const streamAbortController = new AbortController();
    this.abortController = streamAbortController;
    this.isStreaming.set(true);

    try {
      for await (const messages of this.bot.stream(
        nextHistory,
        streamAbortController.signal,
      )) {
        this.messages.set(messages);
      }
    } catch (error) {
      console.error('Error streaming:', error);
      if (!streamAbortController.signal.aborted) {
        this.messages.update((items) => [
          ...this.resolvePendingMessages(
            items,
            'Ответ остановлен из-за ошибки.',
          ),
          this.createErrorMessage(this.mapStreamErrorToMessage(error), true),
        ]);
      }
    } finally {
      this.isStreaming.set(false);
      setTimeout(() => {
        this.focusChatInput();
      });
    }
  }

  onRetryClick(): void {
    const lastHumanMessage = this.messages().find(
      (message) => message.type === 'human',
    );
    if (!lastHumanMessage) return;

    this.onMessageSend(lastHumanMessage.text);
  }

  onStopStream(): void {
    if (!this.isStreaming()) return;

    this.abortController.abort();
    this.abortController = new AbortController();

    setTimeout(() => {
      this.isStreaming.set(false);
      this.messages.set([
        ...this.messages().map((i) => ({ ...i, pending: false })),
        this.createSystemMessage('Ответ остановлен пользователем.'),
      ]);
    }, 10);
  }

  private focusChatInput(): void {
    requestAnimationFrame(() => {
      this.chatInputRef()?.focusInput();
    });
  }

  private scrollMessagesToBottom(): void {
    requestAnimationFrame(() => {
      const viewport = this.messagesViewportRef()?.nativeElement;
      if (!viewport) return;

      viewport.scrollTop = viewport.scrollHeight;
    });
  }

  private createHumanMessage(text: string): DockyMessageHuman {
    return {
      id: this.createMessageId('human'),
      type: 'human',
      text,
    };
  }

  private createSystemMessage(text: string): DockyMessageSystem {
    return {
      id: this.createMessageId('system'),
      type: 'system',
      text,
    };
  }

  private createErrorMessage(text: string, canRetry: boolean): DockyMessage {
    return {
      id: this.createMessageId('error'),
      type: 'error',
      canRetry,
      text,
    };
  }

  private mapStreamErrorToMessage(error: unknown): string {
    if (error instanceof SSERequestError) {
      if (error.status === 401 || error.status === 403) {
        return 'Не удалось отправить сообщение: ошибка авторизации. Обновите страницу и попробуйте снова.';
      }

      if (error.status >= 500) {
        return 'Сервис временно недоступен. Попробуйте отправить сообщение немного позже.';
      }

      return `Ошибка сервиса (${error.status}). Попробуйте ещё раз.`;
    }

    if (error instanceof SSEConnectionError) {
      return 'Соединение с сервером прервалось. Проверьте сеть и повторите отправку.';
    }

    if (error instanceof SSEStreamProtocolError) {
      return 'Получен некорректный ответ сервера. Попробуйте отправить сообщение снова.';
    }

    return 'Не удалось отправить сообщение из-за неизвестной ошибки. Попробуйте ещё раз.';
  }

  private resolvePendingMessages(
    messages: DockyMessage[],
    interruptedText: string,
  ): DockyMessage[] {
    return messages.map((message) => {
      if (message.type === 'agent' && message.pending) {
        return {
          ...message,
          pending: false,
          text: message.text || interruptedText,
        };
      }

      if (message.type === 'tool_call' && message.pending) {
        return {
          ...message,
          pending: false,
        };
      }

      return message;
    });
  }

  private createMessageId(prefix: string): string {
    this.messageCounter += 1;
    return `${prefix}-${Date.now()}-${this.messageCounter}`;
  }

  ngOnDestroy(): void {
    this.abortController.abort();
    this.abortController = new AbortController();
    this.isStreaming.set(false);

    if (this.portalOutlet) {
      this.portalOutlet.detach();
      this.portalOutlet.dispose();
      this.portalOutlet = null;
    }
    this.document.body.style.overflow = '';
  }
}
