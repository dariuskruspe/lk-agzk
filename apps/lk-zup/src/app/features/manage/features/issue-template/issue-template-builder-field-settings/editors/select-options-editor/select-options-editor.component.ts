import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';

// Типы для работы с опциями
interface OptionItem {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

interface OptionSource {
  type: 'manual' | 'api';
  label: string;
  icon: string;
  description: string;
}

@Component({
    selector: 'app-select-options-editor',
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule],
    templateUrl: './select-options-editor.component.html',
    styleUrl: './select-options-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptionsEditorComponent {
  fieldType = input<string>('select');
  value = model<Partial<FpcInputsInterface>>({});

  // Внутреннее состояние
  currentSource = signal<'manual' | 'api'>('manual');
  options = signal<OptionItem[]>([]);
  draggedItem = signal<OptionItem | null>(null);
  dragOverItem = signal<string | null>(null);
  newOptionLabel = signal<string>('');
  newOptionValue = signal<string>('');

  // Источники данных
  optionSources: OptionSource[] = [
    {
      type: 'manual',
      label: 'Ручной ввод',
      icon: 'pi pi-pencil',
      description: 'Добавить опции вручную',
    },
    {
      type: 'api',
      label: 'API запрос',
      icon: 'pi pi-cloud',
      description: 'Загрузить из внешнего источника',
    },
  ];

  // Вычисляемые свойства
  canAddOption = computed(() => {
    const label = this.newOptionLabel().trim();
    const value = this.newOptionValue().trim();
    return (
      label && value && this.isValidLabel(label) && this.isValidValue(value)
    );
  });

  hasUnsavedChanges = computed(() => {
    // TODO: Реализовать логику проверки изменений
    return true;
  });

  constructor() {
    // Инициализация опций из входных данных
    effect(
      () => {
        this.initializeOptions();
      },
      { allowSignalWrites: true },
    );
  }

  private initializeOptions() {
    const value = this.value();
    const optionList = value.optionList || [];

    this.options.set(
      optionList.map((opt, index) => ({
        id: `opt_${index}_${Date.now()}`,
        label: (opt as any).title || (opt as any).label || '',
        value: (opt as any).value || '',
        disabled: (opt as any).disabled,
        description: (opt as any).description,
      })),
    );

    // Определяем источник данных на основе наличия данных
    if (value.optionListRequestAlias) {
      this.currentSource.set('api');
    } else {
      this.currentSource.set('manual');
    }
  }

  setOptionSource(source: 'manual' | 'api') {
    this.currentSource.set(source);

    // При переключении на другой источник очищаем данные предыдущего
    const updates: Partial<FpcInputsInterface> = { ...this.value() };

    if (source === 'manual') {
      // Очищаем API настройки
      delete updates.optionListRequestAlias;
      delete updates.optionListRequestParams;
    } else if (source === 'api') {
      // Очищаем ручные опции
      delete updates.optionList;
      this.options.set([]);
      // Инициализируем API настройки если их нет
      if (!updates.optionListRequestAlias) {
        updates.optionListRequestAlias = 'resourceName';
      }
    }

    this.value.set(updates);
  }

  addNewOption() {
    if (!this.canAddOption()) return;

    const newOption: OptionItem = {
      id: `opt_${Date.now()}`,
      label: this.newOptionLabel().trim(),
      value: this.newOptionValue().trim(),
    };

    this.options.update((current) => [...current, newOption]);
    this.newOptionLabel.set('');
    this.newOptionValue.set('');

    this.emitManualChanges();
  }

  removeOption(optionId: string) {
    this.options.update((current) =>
      current.filter((opt) => opt.id !== optionId),
    );
    this.emitManualChanges();
  }

  updateOption(optionId: string, field: keyof OptionItem, value: any) {
    this.options.update((current) =>
      current.map((opt) =>
        opt.id === optionId ? { ...opt, [field]: value } : opt,
      ),
    );
    this.emitManualChanges();
  }

  moveOption(fromIndex: number, toIndex: number) {
    const options = [...this.options()];
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);

    this.options.set(options);
    this.emitManualChanges();
  }

  // Drag & Drop
  onDragStart(event: DragEvent, option: OptionItem): void {
    this.draggedItem.set(option);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', option.id);
    }
  }

  onDragOver(event: DragEvent, targetOption: OptionItem): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverItem.set(targetOption.id);
  }

  onDragLeave(event: DragEvent): void {
    // Проверяем, что мы действительно покинули элемент
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.dragOverItem.set(null);
    }
  }

  onDrop(event: DragEvent, targetOption: OptionItem): void {
    event.preventDefault();
    this.dragOverItem.set(null);

    const draggedItem = this.draggedItem();
    if (!draggedItem || draggedItem.id === targetOption.id) {
      this.draggedItem.set(null);
      return;
    }

    const options = this.options();
    const fromIndex = options.findIndex((opt) => opt.id === draggedItem.id);
    const toIndex = options.findIndex((opt) => opt.id === targetOption.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      this.moveOption(fromIndex, toIndex);
    }

    this.draggedItem.set(null);
  }

  onDragEnd(): void {
    this.draggedItem.set(null);
    this.dragOverItem.set(null);
  }

  // Генерация value из label
  generateValueFromLabel(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  onLabelChange(optionId: string, newLabel: string) {
    const option = this.options().find((opt) => opt.id === optionId);
    if (option && !option.value) {
      // Автогенерация value если оно пустое
      this.updateOption(
        optionId,
        'value',
        this.generateValueFromLabel(newLabel),
      );
    }
    this.updateOption(optionId, 'label', newLabel);
  }

  onNewLabelChange(newLabel: string) {
    this.newOptionLabel.set(newLabel);
    if (!this.newOptionValue() && newLabel) {
      this.newOptionValue.set(this.generateValueFromLabel(newLabel));
    }
  }

  // Методы для обработки изменений API
  onApiUrlChange(url: string) {
    const updates: any = { ...this.value(), optionListRequestAlias: url };
    this.value.set(updates);
  }

  onApiParamsChange(params: string) {
    try {
      // Пытаемся распарсить JSON для валидации
      if (params.trim()) {
        JSON.parse(params);
      }
      const updates: any = { ...this.value(), optionListRequestParams: params };
      this.value.set(updates);
    } catch (error) {
      console.warn('Неверный формат JSON параметров:', error);
      // Все равно сохраняем, чтобы пользователь мог исправить
      const updates: any = { ...this.value(), optionListRequestParams: params };
      this.value.set(updates);
    }
  }

  private emitManualChanges() {
    const options = this.options();

    const updates: Partial<FpcInputsInterface> = {
      ...this.value(),
      optionList: options.map((opt) => ({
        title: opt.label,
        value: opt.value,
        disabled: opt.disabled,
        description: opt.description,
      })),
    };

    // Очищаем API настройки при ручном вводе
    delete updates.optionListRequestAlias;
    delete updates.optionListRequestParams;

    this.value.set(updates);
  }

  // Валидация
  isValidLabel(label: string): boolean {
    return label.trim().length > 0;
  }

  isValidValue(value: string): boolean {
    const trimmedValue = value.trim();
    if (!trimmedValue) return false;

    // Проверяем на дубликаты
    return !this.options().some((opt) => opt.value === trimmedValue);
  }

  isValidApiAlias(): boolean {
    const alias = this.value().optionListRequestAlias;
    return alias ? alias.trim().length > 0 : false;
  }

  isValidJson(jsonString: string): boolean {
    if (!jsonString.trim()) return true; // Пустая строка считается валидной
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  isDuplicateValue(value: string, excludeId?: string): boolean {
    return this.options().some(
      (opt) => opt.value === value && opt.id !== excludeId,
    );
  }

  isDragOver(optionId: string): boolean {
    return this.dragOverItem() === optionId;
  }

  // Действия с формой
  clearNewOption(): void {
    this.newOptionLabel.set('');
    this.newOptionValue.set('');
  }

  focusNewOptionInput(): void {
    setTimeout(() => {
      const input = document.getElementById('new-option-label');
      input?.focus();
    }, 100);
  }

  // Валидация полей опций
  validateOptionLabel(optionId: string): void {
    const option = this.options().find((opt) => opt.id === optionId);
    if (option && !option.label.trim()) {
      // Можно добавить дополнительную логику валидации
    }
  }

  validateOptionValue(optionId: string): void {
    const option = this.options().find((opt) => opt.id === optionId);
    if (
      option &&
      (!option.value.trim() || this.isDuplicateValue(option.value, optionId))
    ) {
      // Можно добавить дополнительную логику валидации
    }
  }

  // Действия с опциями
  moveOptionUp(index: number): void {
    if (index > 0) {
      this.moveOption(index, index - 1);
    }
  }

  moveOptionDown(index: number): void {
    if (index < this.options().length - 1) {
      this.moveOption(index, index + 1);
    }
  }

  duplicateOption(option: OptionItem): void {
    const newOption: OptionItem = {
      id: `opt_${Date.now()}`,
      label: `${option.label} (копия)`,
      value: this.generateUniqueValue(`${option.value}_copy`),
      disabled: option.disabled,
      description: option.description,
    };

    // Вставляем копию сразу после оригинала
    const currentOptions = this.options();
    const index = currentOptions.findIndex((opt) => opt.id === option.id);
    const newOptions = [...currentOptions];
    newOptions.splice(index + 1, 0, newOption);

    this.options.set(newOptions);
    this.emitManualChanges();
  }

  sortOptionsAlphabetically(): void {
    const sortedOptions = [...this.options()].sort((a, b) =>
      a.label.localeCompare(b.label, 'ru'),
    );
    this.options.set(sortedOptions);
    this.emitManualChanges();
  }

  // Генерация уникального значения
  private generateUniqueValue(baseValue: string): string {
    let value = baseValue;
    let counter = 1;

    while (this.options().some((opt) => opt.value === value)) {
      value = `${baseValue}_${counter}`;
      counter++;
    }

    return value;
  }
}
