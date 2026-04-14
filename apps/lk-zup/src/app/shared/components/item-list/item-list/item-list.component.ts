import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ItemListInterface } from '../models/item-list.interface';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ItemListComponent {
  openedItems: number[] = [];

  @Input() set items(value: ItemListInterface[] | string[] | any[]) {
    if (value?.length && typeof value[0] === 'string') {
      this.updatedItems = (value as string[]).map((item) => ({
        value: item,
      }));
    } else {
      this.updatedItems = value;
    }
  }

  @Input() editOneByOne = false;

  updatedItems: ItemListInterface[] | string[] | any[] = [];

  @Input() titleKey = 'title';

  @Input() valueKey = 'value';

  @Input() showEmpty = true;

  @Input() isEmptyHighlighted = false;

  @Input() font = '16px';

  @Output() changeOne = new EventEmitter<ItemListInterface>();

  expand(item: ItemListInterface, index: number): void {
    if (item.items?.length) {
      this.toggleItem(index);
    }
  }

  isOpened(index: number): boolean {
    return this.openedItems.includes(index);
  }

  private toggleItem(index: number): void {
    if (this.openedItems.includes(index)) {
      this.openedItems = this.openedItems.filter((i) => i !== index);
    } else {
      this.openedItems.push(index);
    }
  }

  editOne(item: ItemListInterface, index: number) {
    this.changeOne.emit({ ...item, index });
  }
}
