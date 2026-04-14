import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupportConfluenceInterface } from '../../models/support-confluence.interface';

@Component({
    selector: 'app-support-confluence-body',
    templateUrl: './support-confluence-body.component.html',
    styleUrls: ['./support-confluence-body.component.scss'],
    standalone: false
})
export class SupportConfluenceBodyComponent {
  @Input() page: SupportConfluenceInterface;

  @Input() menu;

  @Output() menuEvent = new EventEmitter();

  openMenu(): void {
    this.menuEvent.emit();
  }
}
