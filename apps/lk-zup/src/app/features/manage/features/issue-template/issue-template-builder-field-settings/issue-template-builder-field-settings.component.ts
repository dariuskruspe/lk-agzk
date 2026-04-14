import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { FieldSettingsFormComponent } from './field-settings-form/field-settings-form.component';

@Component({
    selector: 'app-issue-template-builder-field-settings',
    imports: [CommonModule, FieldSettingsFormComponent],
    templateUrl: './issue-template-builder-field-settings.component.html',
    styleUrl: './issue-template-builder-field-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class IssueTemplateBuilderFieldSettingsComponent {
  value = input<Partial<FpcInputsInterface>>({});

  // События
  close = output<void>();
  save = output<Partial<FpcInputsInterface>>();

  // Состояние компонента
  isVisible = signal(true);

  onClose() {
    this.isVisible.set(false);
    // Задержка для анимации
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  onSave(value: Partial<FpcInputsInterface>) {
    this.save.emit(value);
    this.onClose();
  }

  onCancel() {
    this.onClose();
  }

  onValueChange(value: Partial<FpcInputsInterface>) {
    // Автосохранение изменений (опционально)
    // Можно добавить debounce для оптимизации
  }
}
