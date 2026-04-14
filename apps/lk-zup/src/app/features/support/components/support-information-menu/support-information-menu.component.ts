import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  SupportHelpMainInterface,
  SupportHelpMenuInterface,
} from '@features/support/models/support-help.interface';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-support-information-menu',
    templateUrl: './support-information-menu.component.html',
    styleUrls: ['./support-information-menu.component.scss'],
    standalone: false
})
export class SupportInformationMenuComponent implements OnChanges {
  @Input() blocks: Observable<SupportHelpMainInterface>;

  @Input() sideMenu: SupportHelpMenuInterface[];

  @Input() isBodyLoading: boolean;

  @Output() menuItemClick = new EventEmitter<string>();

  sideMenuState: SupportHelpMenuInterface[];

  constructor(
    // Angular
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.sideMenu?.currentValue) {
      this.changeSideMenu(this.sideMenu);
    }
  }

  // Генереция объекта с боковым меню
  changeSideMenu(sideMenu: SupportHelpMenuInterface[]): void {
    this.sideMenuState = sideMenu.filter((item) => item.parentId === null);
    if (this.sideMenuState.length) {
      this.sideMenuState.forEach((titleMenu: SupportHelpMenuInterface) => {
        /* eslint-disable no-param-reassign */
        titleMenu.child = sideMenu.filter(
          (item) => item.parentId === titleMenu.pageId
        );
      });

      this.goToSideMenuPageFromRoute();
    }
  }

  /**
   * Переходим на страницу бокового меню, указанную в текущем маршруте (или на первую страницу бокового меню, если
   * таковая не найдена).
   */
  goToSideMenuPageFromRoute(): void {
    const params: Params = this.route?.firstChild?.snapshot?.params;
    const sideMenuFirstPageId: string = this.sideMenuState[0]?.child[0]?.pageId;
    const sideMenuPageIdFromRoute: string =
      params?.pageId || sideMenuFirstPageId;
    this.onMenuItemClick(sideMenuPageIdFromRoute);
  }

  onMenuItemClick(pageId: string): void {
    this.menuItemClick.emit(pageId);
  }
}
