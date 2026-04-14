import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  computed,
} from '@angular/core';
import { LucideAngularModule, BotIcon } from 'lucide-angular';
import { DockyService } from '../../shared/docky.service';

@Component({
  selector: 'app-docky-chat-intro',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './docky-chat-intro.html',
  styleUrl: './docky-chat-intro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockyChatIntro {
  private readonly dockyService = inject(DockyService);
  readonly BotIcon = BotIcon;

  agents = computed(() => this.dockyService.agents());

  clickExample = output<string>();
}
