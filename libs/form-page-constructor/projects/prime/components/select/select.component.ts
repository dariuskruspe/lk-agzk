import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fpc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: false,
})
export class SelectComponent extends BaseComponent implements OnChanges {
  optionLabel: string = 'title';

  @Input() options: any[] = [];

  @Input() hasFilter = false;

  @Input() hideOptions = false;

  @Output() selectEmployee = new EventEmitter<{
    employeeId: string;
    fields: string[];
  }>();

  private subscription: Subscription;

  // Для управления видимостью опций при hideOptions = true
  filteredOptions: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.item?.currentValue &&
      this.item.type === 'select-employee' &&
      this.form
    ) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.form
        .get(this.item.formControlName)
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((employeeId) => {
          this.selectEmployee.emit({
            employeeId,
            fields: this.formData?.options?.staticInfo ?? [],
          });
        });
    }
    if (changes.options?.currentValue) {
      const value = this.form.get(this.item.formControlName)?.value;
      if (
        value &&
        this.options.length &&
        !this.options.find((option) => option.value === value)
      ) {
        this.form.get(this.item.formControlName).setValue('');
      }

      if (Object.keys(this.options[0] || {}).includes('title')) {
        this.optionLabel = 'title';
      } else {
        this.optionLabel = 'representation';
      }

      if (this.item.autoSelectFirst && this.options?.length) {
        this.form
          .get(this.item.formControlName)
          .setValue(this.options[0].value);
      }

      // Инициализируем filteredOptions
      this.updateFilteredOptions();
    }
  }


  onFilter(event: any): void {
    if (this.hideOptions) {
      this.updateFilteredOptions(event.filter);
    }
  }

  onDropdownShow(): void {
    if (this.hideOptions) {
      // Если hideOptions = true и нет фильтра, показываем пустой список
      this.filteredOptions = [];
    }
  }

  onDropdownHide(): void {
    this.filteredOptions = [...this.options];
  }

  private updateFilteredOptions(filterValue?: string): void {
    if (this.hideOptions) {
      if (filterValue && filterValue.trim()) {
        this.filteredOptions = this.options.filter((option) =>
          option[this.optionLabel]
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()),
        );
      } else {
        this.filteredOptions = [];
      }
    } else {
      this.filteredOptions = this.options;
    }
  }
}
