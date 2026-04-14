import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractActionComponent } from '../abstract-action/abstract-action.component';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MessageComponent extends AbstractActionComponent {}
