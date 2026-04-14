import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-widget',
    imports: [CommonModule],
    templateUrl: './widget.component.html',
    styleUrl: './widget.component.scss'
})
export class WidgetComponent {
  /**
   * Заголовок виджета.
   */
  @Input() widgetTitle: string;

  /**
   * Стиль виджета.
   */
  @Input() widgetStyle: any = {};
}
