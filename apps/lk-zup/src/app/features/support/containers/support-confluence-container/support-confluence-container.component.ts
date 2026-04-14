import { Component } from '@angular/core';

@Component({
    selector: 'app-support-confluence-container',
    templateUrl: './support-confluence-container.component.html',
    styleUrls: ['./support-confluence-container.component.scss'],
    standalone: false
})
export class SupportConfluenceContainerComponent {
  // Есть ли меню
  menu = true;

  // Флаг для мобильной версии - меню скрыто
  menuOpened = false;

  openMenu(): void {
    this.menuOpened = true;
  }

  closeMenu(): void {
    this.menuOpened = false;
  }
}
