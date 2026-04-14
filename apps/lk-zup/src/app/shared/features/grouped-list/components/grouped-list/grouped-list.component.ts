import { JsonPipe } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { GroupedListArg } from '../../interfaces/grouped-list-type.interface';

@Component({
    selector: 'app-grouped-list',
    templateUrl: './grouped-list.component.html',
    styleUrls: ['./grouped-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GroupedListComponent implements AfterContentInit {
  @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

  @Input() source!: GroupedListArg<any, any>;

  groupTemplate!: TemplateRef<any>;

  itemTemplate!: TemplateRef<any>;

  ngAfterContentInit() {
    for (const item of this.templates) {
      if (item.getType() === 'group') {
        this.groupTemplate = item.template;
      } else if (item.getType() === 'item') {
        this.itemTemplate = item.template;
      }
    }
  }

  getGroupTitle(group: unknown) {
    if (typeof group === 'string') {
      return group;
    } else {
      return new JsonPipe().transform(group);
    }
  }
}
