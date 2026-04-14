import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LucideAngularModule, SendIcon, SquareIcon } from 'lucide-angular';

@Component({
  selector: 'app-docky-chat-input',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './docky-chat-input.html',
  styleUrl: './docky-chat-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'updateViewportContext()',
  },
})
export class DockyChatInput {
  readonly SendIcon = SendIcon;
  readonly StopIcon = SquareIcon;
  readonly isMultiline = signal(false);
  readonly isMobileContext = signal(false);
  readonly isStreaming = input(false);
  readonly send = output<string>();
  readonly stop = output<void>();
  private readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('chatInput');
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.updateViewportContext();
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement | null;
    if (!textarea) return;

    this.resizeTextarea(textarea);
    this.updateMultilineState(textarea);
  }

  focusInput(): void {
    if (this.isStreaming()) return;

    const textarea = this.textareaRef()?.nativeElement;
    if (!textarea) return;

    this.resizeTextarea(textarea);
    this.updateMultilineState(textarea);
    this.focusTextarea();

    requestAnimationFrame(() => {
      textarea.scrollIntoView({ block: 'nearest' });
    });
  }

  onTextareaKeyDown(event: KeyboardEvent): void {
    if (this.isMobileContext()) return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;

    event.preventDefault();
    this.handlePrimaryAction();
  }

  onSendClick(): void {
    this.handlePrimaryAction();
  }

  onContainerClick(event: MouseEvent): void {
    if (this.isStreaming()) return;

    const target = event.target;
    if (target instanceof Element) {
      if (target.closest('textarea')) return;
      if (target.closest('.docky-chat-input__send')) return;
    }

    this.focusTextarea();
  }

  private resizeTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  updateViewportContext(): void {
    const view = this.document.defaultView;
    if (!view) return;

    const isMobile = view.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    this.isMobileContext.set(isMobile);
  }

  private updateMultilineState(textarea: HTMLTextAreaElement): void {
    const view = textarea.ownerDocument.defaultView;
    if (!view) {
      this.isMultiline.set(textarea.value.includes('\n'));
      return;
    }

    const styles = view.getComputedStyle(textarea);
    const fontSize = Number.parseFloat(styles.fontSize) || 14;
    const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize * 1.4;
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
    const singleLineHeight = lineHeight + paddingTop + paddingBottom;

    this.isMultiline.set(textarea.scrollHeight > singleLineHeight + 1);
  }

  private emitSend(): void {
    const textarea = this.textareaRef()?.nativeElement;
    if (!textarea) return;

    const message = textarea.value.trim();
    if (!message) return;

    this.send.emit(message);

    textarea.value = '';
    this.resizeTextarea(textarea);
    this.updateMultilineState(textarea);
  }

  private handlePrimaryAction(): void {
    if (this.isStreaming()) {
      this.stop.emit();
      return;
    }

    this.emitSend();
  }

  private focusTextarea(): void {
    if (this.isStreaming()) return;

    const textarea = this.textareaRef()?.nativeElement;
    if (!textarea) return;

    textarea.focus();
    const endPosition = textarea.value.length;
    textarea.setSelectionRange(endPosition, endPosition);
  }
}
