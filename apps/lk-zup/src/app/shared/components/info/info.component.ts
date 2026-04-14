import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgSwitch, NgSwitchCase]
})
export class InfoComponent {
  @Input() severity: 'error' | 'info' | 'success' | 'warn' = 'info';
}
