import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupportConfluenceInterface } from '../../models/support-confluence.interface';

@Component({
    selector: 'app-support-confluence-menu',
    templateUrl: './support-confluence-menu.component.html',
    styleUrls: ['./support-confluence-menu.component.scss'],
    standalone: false
})
export class SupportConfluenceMenuComponent {
  menu = [
    {
      title: 'Популярные вопросы',
    },
    {
      title: 'Как происходит прием на работу?',
    },
    {
      title: 'Зачем мне личный кабинет?',
    },
    {
      title: 'Могу ли я отказаться от использования личным кабинетом?',
    },
    {
      title: 'Ну и еще какой то вопрос?',
    },
  ];

  @Input() page: SupportConfluenceInterface;

  @Input() menuOpened;

  @Output() menuEvent = new EventEmitter();

  closeMenu(): void {
    this.menuEvent.emit();
  }
}
