import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NotificationItemInterface } from '../../../features/main/models/notifications.interface';
import { AppDateModule } from '../../pipes/app-date.module';
import { IconPackModule } from '../../pipes/icon-pack.module';

@Component({
    selector: 'app-notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss'],
    imports: [CommonModule, AppDateModule, IconPackModule, ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openedMenu', [
            state('opened', style({ transform: 'translateX(0)' })),
            transition('* => opened', animate('0.2s')),
            transition('opened => *', animate('0.1s')),
        ]),
    ]
})
export class NotificationItemComponent {
  @Input() item: NotificationItemInterface;

  @Output() clicked = new EventEmitter<NotificationItemInterface>();

  @Output() closed = new EventEmitter<NotificationItemInterface>();
}
