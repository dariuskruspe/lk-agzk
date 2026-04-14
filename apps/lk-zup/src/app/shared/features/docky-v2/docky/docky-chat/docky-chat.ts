import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DockyMessage as DockyMessageModel } from '../../shared/types';
import { DockyChatIntro } from '../docky-chat-intro/docky-chat-intro';
import { DockyMessage } from './docky-message/docky-message';
import { DockyWritingAnimation } from '../docky-writing-animation/docky-writing-animation';

@Component({
  selector: 'app-docky-chat',
  standalone: true,
  imports: [DockyChatIntro, DockyMessage, DockyWritingAnimation],
  templateUrl: './docky-chat.html',
  styleUrl: './docky-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockyChat {
  messages = input<DockyMessageModel[]>([]);
  isThinking = input<boolean>(false);
  isStreaming = input<boolean>(false);

  clickExample = output<string>();
  retry = output<void>();
}
