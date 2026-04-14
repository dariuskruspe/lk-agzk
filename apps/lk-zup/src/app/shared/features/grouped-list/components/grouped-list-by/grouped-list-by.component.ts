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

@Component({
    selector: 'app-grouped-list-by',
    templateUrl: './grouped-list-by.component.html',
    styleUrls: ['./grouped-list-by.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GroupedListByComponent implements AfterContentInit {
  @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

  @Input() source!: any[];

  @Input() groupBy!: string;

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

  get groupedSource() {
    const groups = new Map();
    for (const item of this.source) {
      const items = groups.get(item[this.groupBy]) ?? [];
      items.push(item);
      groups.set(item[this.groupBy], items);
    }

    const result = [];
    for (const [key, items] of groups.entries()) {
      result.push({ group: key, items });
    }
    return result;
  }
}
