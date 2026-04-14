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
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';

// Типы для валидации согласно документации
interface ValidationRule {
  id: string;
  type:
    | 'required'
    | 'dynamic-required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'min'
    | 'max'
    | 'email'
    | 'filesType'
    | 'notEqual'
    | 'needToBeChanged'
    | 'date'
    | 'workSchedule'
    | 'syncWorkSchedule'
    | 'periodsGap';
  enabled: boolean;
  value?: any;
  message?: string;
}

interface ValidationRuleTemplate {
  type: ValidationRule['type'];
  label: string;
  description: string;
  icon: string;
  valueType?: 'number' | 'text' | 'regex' | 'boolean';
  placeholder?: string;
  availableForTypes: string[];
  defaultMessage?: string;
  needsValue?: boolean;
}

@Component({
    selector: 'app-validation-rules-editor',
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule],
    templateUrl: './validation-rules-editor.component.html',
    styleUrl: './validation-rules-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationRulesEditorComponent {
  fieldType = input<string>('text');
  value = input<Partial<FpcInputsInterface>>({});

  valueChange = output<Partial<FpcInputsInterface>>();

  // Внутреннее состояние
  activeRules = signal<ValidationRule[]>([]);

  // Шаблоны правил валидации согласно документации
  private ruleTemplates: ValidationRuleTemplate[] = [
    {
      type: 'required',
      label: 'Обязательное поле',
      description: 'Поле должно быть заполнено',
      icon: 'pi pi-exclamation-circle',
      availableForTypes: ['*'],
      defaultMessage: 'Это поле обязательно для заполнения',
    },
    {
      type: 'dynamic-required',
      label: 'Динамически обязательное',
      description: 'Обязательно только если поле видимо',
      icon: 'pi pi-eye',
      availableForTypes: ['*'],
      defaultMessage: 'Это поле обязательно для заполнения',
    },
    {
      type: 'email',
      label: 'Email формат',
      description: 'Проверка формата email',
      icon: 'pi pi-envelope',
      availableForTypes: ['text'],
      defaultMessage: 'Неверный формат email',
    },
    {
      type: 'minLength',
      label: 'Минимальная длина',
      description: 'Минимальное количество символов',
      icon: 'pi pi-arrow-right',
      valueType: 'number',
      placeholder: '3',
      availableForTypes: ['text', 'password', 'textarea'],
      defaultMessage: 'Минимальная длина: {value} символов',
      needsValue: true,
    },
    {
      type: 'maxLength',
      label: 'Максимальная длина',
      description: 'Максимальное количество символов',
      icon: 'pi pi-arrow-left',
      valueType: 'number',
      placeholder: '100',
      availableForTypes: ['text', 'password', 'textarea'],
      defaultMessage: 'Максимальная длина: {value} символов',
      needsValue: true,
    },
    {
      type: 'pattern',
      label: 'Регулярное выражение',
      description: 'Проверка по шаблону',
      icon: 'pi pi-code',
      valueType: 'regex',
      placeholder: '^[A-Za-z0-9]+$',
      availableForTypes: ['text', 'password'],
      defaultMessage: 'Неверный формат данных',
      needsValue: true,
    },
    {
      type: 'min',
      label: 'Минимальное значение',
      description: 'Минимальное числовое значение',
      icon: 'pi pi-arrow-down',
      valueType: 'number',
      placeholder: '0',
      availableForTypes: ['number'],
      defaultMessage: 'Минимальное значение: {value}',
      needsValue: true,
    },
    {
      type: 'max',
      label: 'Максимальное значение',
      description: 'Максимальное числовое значение',
      icon: 'pi pi-arrow-up',
      valueType: 'number',
      placeholder: '1000',
      availableForTypes: ['number'],
      defaultMessage: 'Максимальное значение: {value}',
      needsValue: true,
    },
    {
      type: 'filesType',
      label: 'Типы файлов',
      description: 'Разрешенные типы файлов',
      icon: 'pi pi-file',
      valueType: 'text',
      placeholder: '.png, .jpg',
      availableForTypes: ['file', 'file-multi'],
      defaultMessage: 'Недопустимый тип файла',
      needsValue: true,
    },
    {
      type: 'notEqual',
      label: 'Не равно полю',
      description: 'Значение не должно быть равно указанному полю',
      icon: 'pi pi-not-equal',
      valueType: 'text',
      placeholder: 'fieldName',
      availableForTypes: ['*'],
      defaultMessage: 'Значения полей не должны совпадать',
      needsValue: true,
    },
    {
      type: 'needToBeChanged',
      label: 'Должно быть изменено',
      description: 'Значение в поле должно быть изменено',
      icon: 'pi pi-pencil',
      availableForTypes: ['*'],
      defaultMessage: 'Значение должно быть изменено',
    },
    {
      type: 'date',
      label: 'Тип дня',
      description: 'Ограничение по типу дня',
      icon: 'pi pi-calendar',
      valueType: 'text',
      placeholder: 'dayoff | workday | [0,6]',
      availableForTypes: [
        'datepicker',
        'datepicker-range-start',
        'datepicker-range-end',
      ],
      defaultMessage: 'Недопустимый тип дня',
      needsValue: true,
    },
    {
      type: 'workSchedule',
      label: 'Рабочий график (устаревший)',
      description: 'УСТАРЕВШИЙ. Учет рабочего/индивидуального графиков работы',
      icon: 'pi pi-clock',
      valueType: 'boolean',
      placeholder: 'true | false',
      availableForTypes: [
        'datepicker',
        'datepicker-range-start',
        'datepicker-range-end',
      ],
      defaultMessage: 'Нарушение рабочего графика',
      needsValue: true,
    },
    {
      type: 'syncWorkSchedule',
      label: 'Синхронный рабочий график',
      description: 'Синхронный валидатор для рабочего графика (версии 1.38.0+)',
      icon: 'pi pi-sync',
      valueType: 'text',
      placeholder: 'dayoff | workday | [0,6]',
      availableForTypes: [
        'datepicker',
        'datepicker-range-start',
        'datepicker-range-end',
      ],
      defaultMessage: 'Нарушение рабочего графика',
      needsValue: true,
    },
    {
      type: 'periodsGap',
      label: 'Разрыв периодов',
      description:
        'Валидатор ограничения между разрывами периодов в массиве с datepicker-range',
      icon: 'pi pi-calendar-times',
      valueType: 'text',
      placeholder: '{"end": "dateEnd", "gap": 3}',
      availableForTypes: ['datepicker-range-start'],
      defaultMessage: 'Недопустимый разрыв между периодами',
      needsValue: true,
    },
  ];

  // Доступные правила для текущего типа поля
  availableRules = computed(() => {
    const fieldType = this.fieldType();
    return this.ruleTemplates.filter(
      (template) =>
        template.availableForTypes.includes('*') ||
        template.availableForTypes.includes(fieldType),
    );
  });

  constructor() {
    effect(
      () => {
        this.initializeRules();
      },
      { allowSignalWrites: true },
    );
  }

  private initializeRules() {
    const value: any = this.value();
    const rules: ValidationRule[] = [];

    const validators = value.validations ?? [];
    const errorMessages = value.errorMessages ?? {};

    // Обрабатываем каждый валидатор из массива validations согласно документации
    validators.forEach((validator: any, index: number) => {
      if (typeof validator === 'string') {
        // Простые валидаторы: 'required', 'email', 'needToBeChanged', 'dynamic-required'
        switch (validator) {
          case 'required':
            rules.push({
              id: `required_${index}`,
              type: 'required',
              enabled: true,
              message: errorMessages['required'],
            });
            break;
          case 'email':
            rules.push({
              id: `email_${index}`,
              type: 'email',
              enabled: true,
              message: errorMessages['email'],
            });
            break;
          case 'needToBeChanged':
            rules.push({
              id: `needToBeChanged_${index}`,
              type: 'needToBeChanged',
              enabled: true,
              message: errorMessages['needToBeChanged'],
            });
            break;
          case 'dynamic-required':
            rules.push({
              id: `dynamic-required_${index}`,
              type: 'dynamic-required',
              enabled: true,
              message: errorMessages['dynamic-required'],
            });
            break;
        }
      } else if (typeof validator === 'object' && validator !== null) {
        // Объектные валидаторы
        Object.keys(validator).forEach((key) => {
          const validatorValue = validator[key];

          switch (key) {
            case 'min':
              rules.push({
                id: `min_${index}`,
                type: 'min',
                enabled: true,
                value: validatorValue,
                message: errorMessages['min'],
              });
              break;
            case 'max':
              rules.push({
                id: `max_${index}`,
                type: 'max',
                enabled: true,
                value: validatorValue,
                message: errorMessages['max'],
              });
              break;
            case 'minLength':
              rules.push({
                id: `minLength_${index}`,
                type: 'minLength',
                enabled: true,
                value: validatorValue,
                message: errorMessages['minLength'],
              });
              break;
            case 'maxLength':
              rules.push({
                id: `maxLength_${index}`,
                type: 'maxLength',
                enabled: true,
                value: validatorValue,
                message: errorMessages['maxLength'],
              });
              break;
            case 'pattern':
              rules.push({
                id: `pattern_${index}`,
                type: 'pattern',
                enabled: true,
                value: validatorValue,
                message: errorMessages['pattern'],
              });
              break;
            case 'filesType':
              rules.push({
                id: `filesType_${index}`,
                type: 'filesType',
                enabled: true,
                value: validatorValue,
                message: errorMessages['filesType'],
              });
              break;
            case 'notEqual':
              rules.push({
                id: `notEqual_${index}`,
                type: 'notEqual',
                enabled: true,
                value: validatorValue,
                message: errorMessages['notEqual'],
              });
              break;
            case 'date':
              rules.push({
                id: `date_${index}`,
                type: 'date',
                enabled: true,
                value: validatorValue,
                message: errorMessages['date'],
              });
              break;
            case 'workSchedule':
              rules.push({
                id: `workSchedule_${index}`,
                type: 'workSchedule',
                enabled: true,
                value: validatorValue,
                message: errorMessages['workSchedule'],
              });
              break;
            case 'syncWorkSchedule':
              rules.push({
                id: `syncWorkSchedule_${index}`,
                type: 'syncWorkSchedule',
                enabled: true,
                value: validatorValue,
                message: errorMessages['syncWorkSchedule'],
              });
              break;
            case 'periodsGap':
              rules.push({
                id: `periodsGap_${index}`,
                type: 'periodsGap',
                enabled: true,
                value: validatorValue,
                message: errorMessages['periodsGap'],
              });
              break;
          }
        });
      }
    });

    this.activeRules.set(rules);
  }

  private generateRuleId(type: ValidationRule['type']): string {
    return `${type}_${Date.now()}`;
  }

  addRule(ruleType: ValidationRule['type']) {
    // Проверяем, что правило еще не добавлено
    if (this.hasRule(ruleType)) {
      return;
    }

    const template = this.getRuleTemplate(ruleType);
    if (!template) {
      return;
    }

    const newRule: ValidationRule = {
      id: this.generateRuleId(ruleType),
      type: ruleType,
      enabled: true,
      message: template.defaultMessage,
    };

    // Устанавливаем значение по умолчанию для некоторых типов
    if (template.needsValue) {
      if (template.valueType === 'number') {
        newRule.value = template.placeholder ? +template.placeholder : 0;
      } else if (
        template.valueType === 'text' ||
        template.valueType === 'regex'
      ) {
        newRule.value = template.placeholder || '';
      } else if (template.valueType === 'boolean') {
        newRule.value = false;
      }
    }

    const currentRules = this.activeRules();
    this.activeRules.set([...currentRules, newRule]);
    this.emitChanges();
  }

  removeRule(ruleId: string) {
    const currentRules = this.activeRules().filter(
      (rule) => rule.id !== ruleId,
    );
    this.activeRules.set(currentRules);
    this.emitChanges();
  }

  updateRule(ruleId: string, updates: Partial<ValidationRule>) {
    const currentRules = this.activeRules();
    const ruleIndex = currentRules.findIndex((rule) => rule.id === ruleId);

    if (ruleIndex >= 0) {
      const updatedRules = [...currentRules];
      updatedRules[ruleIndex] = { ...updatedRules[ruleIndex], ...updates };
      this.activeRules.set(updatedRules);
      this.emitChanges();
    }
  }

  toggleRule(ruleId: string) {
    const currentRules = this.activeRules();
    const ruleIndex = currentRules.findIndex((rule) => rule.id === ruleId);

    if (ruleIndex >= 0) {
      const updatedRules = [...currentRules];
      updatedRules[ruleIndex] = {
        ...updatedRules[ruleIndex],
        enabled: !updatedRules[ruleIndex].enabled,
      };
      this.activeRules.set(updatedRules);
      this.emitChanges();
    }
  }

  getRuleTemplate(
    ruleType: ValidationRule['type'],
  ): ValidationRuleTemplate | undefined {
    return this.ruleTemplates.find((template) => template.type === ruleType);
  }

  hasRule(ruleType: ValidationRule['type']): boolean {
    return this.activeRules().some((rule) => rule.type === ruleType);
  }

  needsValue(ruleType: ValidationRule['type']): boolean {
    const template = this.getRuleTemplate(ruleType);
    return template?.needsValue === true;
  }

  updateRuleNumberValue(ruleId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateRule(ruleId, { value: +target.value });
  }

  updateRuleTextValue(ruleId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateRule(ruleId, { value: target.value });
  }

  updateRuleMessage(ruleId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateRule(ruleId, { message: target.value });
  }

  private emitChanges() {
    const activeRules = this.activeRules();
    const validations: any[] = [];
    const errorMessages: { [key: string]: string } = {};

    // Формируем массив validations согласно документации
    for (const rule of activeRules) {
      if (!rule.enabled) continue;

      switch (rule.type) {
        case 'required':
          validations.push('required');
          if (rule.message?.trim()) errorMessages['required'] = rule.message;
          break;
        case 'dynamic-required':
          validations.push('dynamic-required');
          if (rule.message?.trim())
            errorMessages['dynamic-required'] = rule.message;
          break;
        case 'email':
          validations.push('email');
          if (rule.message?.trim()) errorMessages['email'] = rule.message;
          break;
        case 'needToBeChanged':
          validations.push('needToBeChanged');
          if (rule.message?.trim())
            errorMessages['needToBeChanged'] = rule.message;
          break;
        case 'minLength':
          validations.push({ minLength: rule.value });
          if (rule.message?.trim()) errorMessages['minLength'] = rule.message;
          break;
        case 'maxLength':
          validations.push({ maxLength: rule.value });
          if (rule.message?.trim()) errorMessages['maxLength'] = rule.message;
          break;
        case 'pattern':
          validations.push({ pattern: rule.value });
          if (rule.message?.trim()) errorMessages['pattern'] = rule.message;
          break;
        case 'min':
          validations.push({ min: rule.value });
          if (rule.message?.trim()) errorMessages['min'] = rule.message;
          break;
        case 'max':
          validations.push({ max: rule.value });
          if (rule.message?.trim()) errorMessages['max'] = rule.message;
          break;
        case 'filesType':
          validations.push({ filesType: rule.value });
          if (rule.message?.trim()) errorMessages['filesType'] = rule.message;
          break;
        case 'notEqual':
          validations.push({ notEqual: rule.value });
          if (rule.message?.trim()) errorMessages['notEqual'] = rule.message;
          break;
        case 'date':
          validations.push({ date: rule.value });
          if (rule.message?.trim()) errorMessages['date'] = rule.message;
          break;
        case 'workSchedule':
          validations.push({ workSchedule: rule.value });
          if (rule.message?.trim())
            errorMessages['workSchedule'] = rule.message;
          break;
        case 'syncWorkSchedule':
          validations.push({ syncWorkSchedule: rule.value });
          if (rule.message?.trim())
            errorMessages['syncWorkSchedule'] = rule.message;
          break;
        case 'periodsGap':
          validations.push({ periodsGap: rule.value });
          if (rule.message?.trim()) errorMessages['periodsGap'] = rule.message;
          break;
      }
    }

    const updates = {
      validations: validations.length > 0 ? validations : [],
      errorMessages:
        Object.keys(errorMessages).length > 0 ? errorMessages : undefined,
    };

    this.valueChange.emit(updates);
  }
}
