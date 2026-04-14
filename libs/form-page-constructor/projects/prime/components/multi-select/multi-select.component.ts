import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import {MultiSelectChangeEvent} from "primeng/multiselect";

@Component({
    selector: 'fpc-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss'],
    standalone: false
})
export class MultiSelectComponent extends BaseComponent implements OnChanges {
  optionLabel: string = 'title';

  grouped = false;

  @Input() options: any[] = [];

  private optionsLength: number = 0;

  checkboxes = {}

  get selectionLimit(): number {
    return this.item?.selectMultiple
      ? this.optionsLength
      : 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.optionsLength = this.options?.length || 0;

    if (changes.options?.currentValue && this.options.length) {
      const validOptions = (this.form
        .get(this.item.formControlName)?.value as any[] || [])
        .filter((item) => this.options.find(option => option.value === item));
      this.form.get(this.item.formControlName).setValue(validOptions);
    }

    if (changes.options?.currentValue && changes.options?.currentValue[0]?.items) {
      this.grouped = true;
      this.optionsLength = changes.options?.currentValue.reduce((acc, group) => {
        this.checkboxes[group.value] = false;
        const length = acc + (group.items?.length ?? 0);
        return length;
      }, 0);
    }

    if (this.options && Object.keys(this.options[0] || {}).includes('title')) {
      this.optionLabel = 'title';
    } else {
      this.optionLabel = 'representation';
    }
  }

  onGroupClick(group: {items: {value: any}[], value: any}) {
    let choosen = this.form.get(this.item.formControlName)?.value as any[] || [];

    let isGroupChosen = true;
    for (let i = 0; i < group.items?.length; i += 1) {
      if (!choosen.includes(group.items?.[i].value)) {
        isGroupChosen = false;
        break;
      }
    }

    choosen = choosen.filter(value => !group.items?.find(item => item.value === value));
    if (!isGroupChosen) {
      choosen = [...choosen, ...(group.items?.map(item => item.value) ?? [])];
    }

    this.form.get(this.item.formControlName)?.setValue(choosen.length ? choosen : '');
    if (group.value) {
      this.checkboxes[group.value.toString()] = !isGroupChosen;
    }
  }

  selectItem(event: MultiSelectChangeEvent): void {
    if (this.grouped) {
      let choosen = this.form.get(this.item.formControlName)?.value as any[] || [];

      const changedGroup = this.options.find(group => group.items.find(item => item.value === event.itemValue));
      if (!changedGroup) return;

      let isGroupChosen = true;
      for (let i = 0; i < changedGroup.items?.length; i += 1) {
        if (!choosen.includes(changedGroup.items?.[i].value)) {
          isGroupChosen = false;
          break;
        }
      }
      this.checkboxes[(changedGroup.value).toString()] = isGroupChosen;
    }
  }
}
