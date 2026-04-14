import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { TrustedHtmlModule } from '@app/shared/pipes/security/trusted-html.module';
import { DockyMessage as DockyMessageModel } from '../../../shared/types';

@Component({
  selector: 'app-docky-message',
  standalone: true,
  imports: [NgComponentOutlet, TrustedHtmlModule],
  templateUrl: './docky-message.html',
  styleUrl: './docky-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DockyMessage {
  message = input.required<DockyMessageModel>();
  retry = output<void>();
}
