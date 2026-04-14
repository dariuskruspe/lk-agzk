import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BasicSettingsEditorComponent } from '../editors/basic-settings-editor/basic-settings-editor.component';
import { SelectOptionsEditorComponent } from '../editors/select-options-editor/select-options-editor.component';
import { ValidationRulesEditorComponent } from '../editors/validation-rules-editor/validation-rules-editor.component';
import { DependenciesEditorComponent } from '../editors/dependencies-editor/dependencies-editor.component';

// Типы для системы настроек
type SettingsComplexity = 'basic' | 'advanced' | 'expert';
type SectionName =
  | 'basic'
  | 'options'
  | 'validation'
  | 'dateValidation'
  | 'dependencies'
  | 'advanced'
  | 'arrSmart'
  | 'fileSettings';

interface FieldSettingsSection {
  name: SectionName;
  title: string;
  icon: string;
  level: SettingsComplexity;
  description?: string;
  availableForTypes: string[];
}

@Component({
    selector: 'app-field-settings-form',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        BasicSettingsEditorComponent,
        SelectOptionsEditorComponent,
        ValidationRulesEditorComponent,
        DependenciesEditorComponent,
    ],
    templateUrl: './field-settings-form.component.html',
    styleUrl: './field-settings-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldSettingsFormComponent {
  fieldType = input<string>('text');
  initialValue = input<Partial<FpcInputsInterface>>({});

  // События
  valueChange = output<Partial<FpcInputsInterface>>();
  save = output<Partial<FpcInputsInterface>>();
  cancel = output<void>();

  // Состояние
  currentComplexity = signal<SettingsComplexity>('expert');
  currentSection = signal<SectionName>('basic');

  // Данные формы
  formValue = signal<Partial<FpcInputsInterface>>({});
  hasUnsavedChanges = signal<boolean>(false);

  // Доступные секции для разных типов полей
  availableSections = computed(() => {
    const fieldType = this.fieldType();
    return this.allSections.filter(
      (section) =>
        section.availableForTypes.includes(fieldType) ||
        section.availableForTypes.includes('*'),
    );
  });

  // Видимые секции - всегда все доступные (экспертный режим)
  visibleSections = computed(() => {
    return this.availableSections();
  });

  private allSections: FieldSettingsSection[] = [
    {
      name: 'basic',
      title: 'Основное',
      icon: 'pi pi-cog',
      level: 'basic',
      description: 'Базовые настройки поля',
      availableForTypes: ['*'], // Доступно для всех типов
    },
    {
      name: 'options',
      title: 'Опции',
      icon: 'pi pi-list',
      level: 'basic',
      description: 'Настройка списка опций',
      availableForTypes: ['select', 'select-multi', 'select-filter', 'radio'],
    },
    {
      name: 'validation',
      title: 'Валидация',
      icon: 'pi pi-check-circle',
      level: 'advanced',
      description: 'Правила валидации',
      availableForTypes: ['*'], // Доступно для всех типов полей
    },
    {
      name: 'dependencies',
      title: 'Зависимости',
      icon: 'pi pi-share-alt',
      level: 'expert',
      description: 'Связи между полями',
      availableForTypes: ['*'],
    },
    {
      name: 'arrSmart',
      title: 'Настройки arr-smart',
      icon: 'pi pi-th-large',
      level: 'expert',
      description: 'Настройки для группы произвольных полей',
      availableForTypes: ['arr-smart'],
    },
    {
      name: 'fileSettings',
      title: 'Настройки файлов',
      icon: 'pi pi-file',
      level: 'advanced',
      description: 'Настройки загрузки файлов',
      availableForTypes: ['file', 'file-multi'],
    },
  ];

  complexityLevels: SettingsComplexity[] = ['basic', 'advanced', 'expert'];

  constructor() {
    // Инициализация значения
    effect(
      () => {
        this.formValue.set(this.initialValue());
      },
      { allowSignalWrites: true },
    );
  }

  setComplexity(level: SettingsComplexity) {
    this.currentComplexity.set(level);

    // Переключаемся на первую доступную секцию если текущая недоступна
    const visibleSections = this.visibleSections();
    const currentSection = this.currentSection();

    if (!visibleSections.some((s) => s.name === currentSection)) {
      this.currentSection.set(visibleSections[0]?.name || 'basic');
    }
  }

  setCurrentSection(sectionName: SectionName) {
    this.currentSection.set(sectionName);
  }

  getFieldTypeLabel(): string {
    const typeLabels: Record<string, string> = {
      static: 'Статичный текст',
      'computed-static': 'Вычисляемый статичный текст',
      text: 'Текстовое поле',
      number: 'Числовое поле',
      password: 'Поле пароля',
      textarea: 'Многострочное поле',
      checkbox: 'Чекбокс',
      radio: 'Радио кнопки',
      select: 'Выпадающий список',
      'select-multi': 'Множественный выбор',
      'select-filter': 'Список с фильтрацией',
      'select-employee': 'Выбор сотрудника',
      datepicker: 'Выбор даты',
      'datepicker-month': 'Выбор месяца',
      'datepicker-year': 'Выбор года',
      'datepicker-range-start': 'Начало диапазона дат',
      'datepicker-range-end': 'Конец диапазона дат',
      timepicker: 'Выбор времени',
      file: 'Загрузка файла',
      'file-multi': 'Множественная загрузка файлов',
      'arr-smart': 'Группа произвольных полей',
    };

    return typeLabels[this.fieldType()] || 'Настройки поля';
  }

  getCurrentSectionData(): FieldSettingsSection | undefined {
    return this.visibleSections().find((s) => s.name === this.currentSection());
  }

  sectionHasChanges(section: FieldSettingsSection): boolean {
    // TODO: Реализовать проверку изменений для конкретной секции
    return false;
  }

  updateFormValue(updates: Partial<FpcInputsInterface>) {
    const currentValue = this.formValue();
    const newValue = { ...currentValue, ...updates };
    this.formValue.set(newValue);
    this.hasUnsavedChanges.set(true);
    this.valueChange.emit(newValue);
  }

  resetChanges() {
    this.formValue.set(this.initialValue());
    this.hasUnsavedChanges.set(false);
  }

  onSave() {
    this.save.emit(this.formValue());
    this.hasUnsavedChanges.set(false);
  }

  onCancel() {
    this.cancel.emit();
  }
}
