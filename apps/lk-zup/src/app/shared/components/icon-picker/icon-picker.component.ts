import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import icons from './icons.json';

@Component({
    selector: 'app-icon-picker',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
    ],
    templateUrl: './icon-picker.component.html',
    styleUrl: './icon-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconPickerComponent),
            multi: true,
        },
    ]
})
export class IconPickerComponent implements ControlValueAccessor {
  protected readonly value = signal<string | undefined>(undefined);
  protected readonly disabled = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly filteredIcons = signal<string[]>([]);
  protected readonly searchTerm = signal('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string | undefined) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  readonly icons: string[] = [
    ...icons['hrm-icons'].map((icon) => `hrm-icons ${icon}`),
    ...icons.primeicons.map((icon) => `pi ${icon}`),
  ];

  constructor() {
    this.filteredIcons.set(this.icons);
  }

  writeValue(value: string | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected showDialog(): void {
    if (this.disabled()) return;
    this.searchTerm.set('');
    this.filterIcons();
    this.dialogVisible.set(true);
  }

  protected selectIcon(icon: string): void {
    this.value.set(icon);
    this.onChange(icon);
    this.onTouched();
    this.dialogVisible.set(false);
  }

  protected filterIcons(): void {
    const searchTerm = this.searchTerm().toLowerCase();
    if (!searchTerm) {
      this.filteredIcons.set(this.icons);
      return;
    }
    this.filteredIcons.set(
      this.icons.filter((icon) => icon.toLowerCase().includes(searchTerm)),
    );
  }
}
