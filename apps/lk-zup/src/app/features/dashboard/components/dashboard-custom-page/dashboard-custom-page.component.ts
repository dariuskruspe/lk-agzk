import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  SupportHelpMainInterface,
  SupportHelpMenuInterface,
} from '@app/features/support/models/support-help.interface';

@Component({
  selector: 'app-dashboard-custom-page',
  templateUrl: './dashboard-custom-page.component.html',
  styleUrls: ['./dashboard-custom-page.component.scss'],
  standalone: false,
})
export class DashboardCustomPageComponent implements OnChanges {
  @Input() blocks: SupportHelpMainInterface;

  @Input() sideMenu: SupportHelpMenuInterface[];

  @Output() menuItemClickEvent = new EventEmitter<{
    pageId: string;
    title: string;
  }>();

  panelOpenState;

  panelInformationOpenState = {};

  sideMenuState: SupportHelpMenuInterface[];

  isCollapseMenu: boolean;

  activeTab: string;

  indexReplaceArr: {
    from: number;
    to?: number;
    patternStart: string;
  }[];

  ngOnChanges(changes: SimpleChanges): void {

    if (changes?.sideMenu?.currentValue) {
      this.changeSideMenu(this.sideMenu);
    }

    // todo start: методы для поиска подстроки для дальнйшей модификации
    if (changes?.blocks?.currentValue) {
      for (const block of this.blocks?.markup ?? []) {
        this.indexReplaceArr = [];
        this.addSrcIndexArr(block?.content?.body, 'src="');
      }
    }
  }

  addSrcIndexArr(str: string, pattern: string, index: number = 0): void {
    if (str) {
      const from = this.searchSrcString(str, pattern, index);
      if (from > -1) {
        this.indexReplaceArr.push({
          from,
          patternStart: pattern,
        });
        this.addSrcIndexArr(str, pattern, from + 1);
      } else {
        for (let i = 0; i < this.indexReplaceArr?.length; i += 1) {
          const to = this.searchSrcString(
            str,
            '"',
            this.indexReplaceArr[i].from +
              this.indexReplaceArr[i].patternStart.length,
          );
          if (to > -1) {
            this.indexReplaceArr[i].to = to;
          }
        }
      }
    }
  }

  searchSrcString(str: string, pattern: string, index: number): number {
    return str.indexOf(pattern, index);
  }
  // todo end

  // Генереция объекта с боковым меню
  changeSideMenu(sideMenu: SupportHelpMenuInterface[]): void {
    this.sideMenuState = sideMenu.filter((item) => item.parentId === null);
    if (this.sideMenuState.length !== sideMenu.length) {
      this.isCollapseMenu = true;
      this.sideMenuState.forEach((titleMenu: SupportHelpMenuInterface) => {
        // eslint-disable-next-line no-param-reassign
        titleMenu.child = sideMenu.filter(
          (item) => item.parentId === titleMenu.pageId,
        );
      });
    } else {
      this.isCollapseMenu = false;
    }
  }

  downloadURI(i: number): void {
    const uri = this.blocks.markup[i].content.link;
    const name = this.blocks.markup[i].content.introText;
    const ext = uri.substring(5, uri.indexOf(';'));
    const link = document.createElement('a');
    link.href = uri;
    link.download = name + '.' + ext;
    document.body.appendChild(link);
    link.click();
  }
}
