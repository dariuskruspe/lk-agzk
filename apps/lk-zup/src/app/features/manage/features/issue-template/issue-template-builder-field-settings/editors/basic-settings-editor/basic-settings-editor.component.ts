import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  signal,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import {
  SettingsGroupComponent,
  SettingsGroup,
} from '../../../../../../../shared/components/settings-group/settings-group.component';

// Типы для базовых настроек, расширяем общий SettingsGroup
interface BasicSettingsGroup extends SettingsGroup {
  fields: BasicSettingField[];
}

interface BasicSettingField {
  key: string; // Изменено с keyof FpcInputsInterface на string для большей гибкости
  label: string;
  type: 'text' | 'textarea' | 'boolean' | 'select' | 'number';
  placeholder?: string;
  description?: string;
  options?: { label: string; value: any }[];
  availableForTypes?: string[];
  notAvailableForTypes?: string[];
  min?: number;
  max?: number;
  required?: boolean; // Добавлено для валидации в редакторе
}

@Component({
    selector: 'app-basic-settings-editor',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        SettingsGroupComponent,
    ],
    templateUrl: './basic-settings-editor.component.html',
    styleUrl: './basic-settings-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicSettingsEditorComponent {
  fieldType = input<string>('text');
  value = model<Partial<FpcInputsInterface>>({});

  // Событие для уведомления о готовности данных к сохранению
  canSave = output<boolean>();

  // Внутреннее состояние
  formData = signal<Partial<FpcInputsInterface>>({});

  // Флаг для предотвращения показа ошибок до полной инициализации
  isInitialized = signal<boolean>(false);

  // Все группы раскрыты по умолчанию для улучшения UX

  // Конфигурация всех базовых настроек с улучшенными описаниями
  // Описания переработаны для простоты и понятности
  private allSettings: BasicSettingsGroup[] = [
    {
      key: 'display',
      title: 'Отображение',
      icon: 'pi pi-eye',
      fields: [
        {
          key: 'formControlName',
          label: 'Имя поля',
          type: 'text',
          placeholder: 'fieldName',
          description: 'Уникальное имя для обработки данных формы',
          notAvailableForTypes: ['static'],
          required: true,
        },
        {
          key: 'label',
          label: 'Название поля',
          type: 'text',
          placeholder: 'Введите название',
          description: 'Название, которое увидит пользователь',
          notAvailableForTypes: ['static', 'computed-static'],
          required: true,
        },
        {
          key: 'placeholder',
          label: 'Подсказка в поле',
          type: 'text',
          placeholder: 'Введите подсказку',
          description: 'Текст-подсказка внутри поля ввода',
          availableForTypes: [
            'text',
            'number',
            'password',
            'textarea',
            'select',
            'select-multi',
            'select-filter',
          ],
        },
        {
          key: 'hintMessage',
          label: 'Помощь под полем',
          type: 'text',
          placeholder: 'Дополнительная информация',
          description: 'Поясняющий текст под полем',
          notAvailableForTypes: ['static', 'computed-static'],
        },
        {
          key: 'value',
          label: 'Начальное значение',
          type: 'text',
          placeholder: 'Значение по умолчанию',
          description: 'Значение, установленное при загрузке формы',
          notAvailableForTypes: ['static', 'computed-static'],
        },
        {
          key: 'value',
          label: 'Текст для отображения',
          type: 'textarea',
          placeholder: 'Введите текст',
          description: 'Статический текст для отображения',
          availableForTypes: ['static'],
        },
      ],
    },
    {
      key: 'behavior',
      title: 'Поведение',
      icon: 'pi pi-cog',
      fields: [
        {
          key: 'disabled',
          label: 'Заблокировать поле',
          type: 'boolean',
          description: 'Поле будет недоступно для изменения',
          notAvailableForTypes: ['static', 'computed-static'],
        },
        {
          key: 'edited',
          label: 'Разрешить изменение',
          type: 'boolean',
          description: 'Пользователь может изменять значение поля',
          notAvailableForTypes: ['static', 'computed-static'],
        },
        {
          key: 'autoSelectFirst',
          label: 'Выбрать первый элемент',
          type: 'boolean',
          description: 'Автоматически выбрать первый вариант из списка',
          availableForTypes: ['select', 'select-multi', 'select-filter'],
        },
        {
          key: 'selectMultiple',
          label: 'Выбор нескольких вариантов',
          type: 'boolean',
          description: 'Разрешить выбор нескольких элементов списка',
          availableForTypes: ['select', 'select-filter'],
        },
        {
          key: 'selectParentTree',
          label: 'Иерархический список',
          type: 'boolean',
          description: 'Показать список в виде дерева с подкатегориями',
          availableForTypes: ['select', 'select-multi', 'select-filter'],
        },
        {
          key: 'onlyFirst',
          label: 'Активно только первое',
          type: 'boolean',
          description: 'В группе полей активно только первое поле',
          availableForTypes: ['arr-smart'],
        },
      ],
    },
    {
      key: 'layout',
      title: 'Размещение',
      icon: 'pi pi-th-large',
      fields: [
        {
          key: 'span',
          label: 'Ширина поля',
          type: 'select',
          description: 'Какую часть строки займет поле',
          options: [
            { label: '1/12 строки', value: 1 },
            { label: '1/6 строки', value: 2 },
            { label: '1/4 строки', value: 3 },
            { label: '1/3 строки', value: 4 },
            { label: 'Половина строки', value: 6 },
            { label: 'Вся строка', value: 12 },
          ],
        },
        {
          key: 'gridClasses',
          label: 'Дополнительные стили',
          type: 'text',
          placeholder: 'col-md-6 custom-class',
          description: 'CSS-классы для тонкой настройки внешнего вида',
        },
        {
          key: 'hidden',
          label: 'Скрыть поле',
          type: 'boolean',
          description: 'Поле не будет показано пользователю',
        },
      ],
    },

    {
      key: 'formatting',
      title: 'Форматирование',
      icon: 'pi pi-pencil',
      fields: [
        {
          key: 'mask',
          label: 'Маска ввода',
          type: 'text',
          placeholder: '+7 (999) 999-99-99',
          description: 'Шаблон для форматирования вводимых данных',
          availableForTypes: ['text', 'number'],
        },
        {
          key: 'format',
          label: 'Формат даты',
          type: 'select',
          description: 'В каком виде сохранять дату',
          availableForTypes: [
            'datepicker',
            'datepicker-month',
            'datepicker-year',
          ],
          options: [
            { label: 'День.месяц.год (12.03.2024)', value: 'dd.mm.yyyy' },
            { label: 'Месяц.год (03.2024)', value: 'mm.yyyy' },
            { label: 'Только год (2024)', value: 'yyyy' },
          ],
        },
      ],
    },
    {
      key: 'files',
      title: 'Настройки файлов',
      icon: 'pi pi-file',
      fields: [
        {
          key: 'fileTypesAccept',
          label: 'Разрешенные типы файлов',
          type: 'text',
          placeholder: '.png, .jpg, .gif',
          description: 'Какие файлы можно загружать (через запятую)',
          availableForTypes: ['file', 'file-multi'],
        },
      ],
    },
    {
      key: 'arrSmartSettings',
      title: 'Настройки группы полей',
      icon: 'pi pi-th-large',
      fields: [
        {
          key: 'arrSmartOpened',
          label: 'Открытых блоков по умолчанию',
          type: 'number',
          placeholder: '1',
          description: 'Сколько блоков будет открыто при загрузке',
          availableForTypes: ['arr-smart'],
          min: 0,
        },
      ],
    },
    {
      key: 'references',
      title: 'Связи между полями',
      icon: 'pi pi-link',
      fields: [
        {
          key: 'startDateControl',
          label: 'Поле начальной даты',
          type: 'text',
          placeholder: 'dateBegin',
          description: 'Имя поля с датой начала периода',
          availableForTypes: ['datepicker-range-end'],
        },
        {
          key: 'endDateControl',
          label: 'Поле конечной даты',
          type: 'text',
          placeholder: 'dateEnd',
          description: 'Имя поля с датой окончания периода',
          availableForTypes: ['datepicker-range-start'],
        },
        {
          key: 'minReferenceDateControl',
          label: 'Поле минимальной даты',
          type: 'text',
          placeholder: 'startDate',
          description: 'Имя поля, которое ограничивает минимальную дату',
          availableForTypes: [
            'datepicker',
            'datepicker-range-start',
            'datepicker-range-end',
          ],
        },
        {
          key: 'maxReferenceDateControl',
          label: 'Поле максимальной даты',
          type: 'text',
          placeholder: 'endDate',
          description: 'Имя поля, которое ограничивает максимальную дату',
          availableForTypes: [
            'datepicker',
            'datepicker-range-start',
            'datepicker-range-end',
          ],
        },
        {
          key: 'target',
          label: 'Способ открытия ссылки',
          type: 'select',
          description: 'Где открывать ссылку при клике',
          availableForTypes: ['static'],
          options: [
            { label: 'Новое окно', value: '_blank' },
            { label: 'Текущее окно', value: '_self' },
          ],
        },
      ],
    },
  ];

  // Отфильтрованные настройки для текущего типа поля
  availableSettings = computed(() => {
    const fieldType = this.fieldType();

    return this.allSettings
      .map((group) => ({
        ...group,
        fields: group.fields.filter((field) => {
          const isAvailable =
            !field.availableForTypes ||
            field.availableForTypes.includes(fieldType);

          const isNotAvailable =
            field.notAvailableForTypes &&
            field.notAvailableForTypes.includes(fieldType);

          return isAvailable && !isNotAvailable;
        }),
      }))
      .filter((group) => group.fields.length > 0);
  });

  // Вычисляемое свойство для проверки валидности формы
  // Проверяет только поля с required: true в конфигурации редактора (formControlName, label)
  isFormValid = computed(() => {
    const settings = this.availableSettings();

    // Проходим по всем группам и полям, проверяем только редакторские обязательные поля
    for (const group of settings) {
      for (const field of group.fields) {
        if (field.required) {
          const value = this.getFieldValue(field.key);
          // Поле считается незаполненным если оно undefined, null, пустая строка или только пробелы
          if (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
          ) {
            return false;
          }
        }
      }
    }
    return true;
  });

  constructor() {
    // Синхронизация внутреннего состояния с входными данными
    effect(
      () => {
        this.formData.set(this.value());
        // Устанавливаем флаг инициализации после первой синхронизации данных
        // Используем setTimeout для обеспечения, что все изменения завершены
        setTimeout(() => this.isInitialized.set(true), 0);
      },
      { allowSignalWrites: true },
    );

    // Отслеживаем изменения валидности формы и уведомляем родительский компонент
    effect(() => {
      this.canSave.emit(this.isFormValid());
    });
  }

  // Удалены методы управления группами - теперь это делает SettingsGroupComponent

  updateField(fieldKey: string, value: any) {
    const newData: Partial<FpcInputsInterface> = {
      ...this.formData(),
    };

    if (fieldKey === 'hidden') {
      // Специальная логика для управления классом «hidden» в gridClasses
      // Это позволяет пользователю управлять видимостью поля через удобный чекбокс
      let classes: string[] = Array.isArray(newData.gridClasses)
        ? [...(newData.gridClasses as string[])]
        : ((newData.gridClasses as unknown as string) || '').split(' ');

      classes = classes.filter((c) => c && c !== 'hidden');
      if (value) {
        classes.push('hidden');
      }
      newData.gridClasses = classes;
    } else if (fieldKey === 'gridClasses') {
      // Преобразуем введённую строку в массив, убирая лишние пробелы и дубликаты
      const typed = (value as string) ?? '';
      const tokens = typed
        .split(' ')
        .map((t) => t.trim())
        .filter((t) => !!t);

      // Не позволяем пользователю управлять «hidden» здесь – он контролируется чекбоксом
      const withoutHidden = tokens.filter((t) => t !== 'hidden');

      // Сохраняем актуальное значение «hidden», если оно выставлено флагом
      const hiddenActive = this.getFieldValue('hidden');
      if (hiddenActive && !withoutHidden.includes('hidden')) {
        withoutHidden.push('hidden');
      }

      newData.gridClasses = withoutHidden;
    } else {
      // Обычное обновление поля
      (newData as any)[fieldKey] = value;
    }

    // Обновляем состояние и уведомляем родительский компонент
    this.formData.set(newData);
    this.value.set(newData);
  }

  getFieldValue(fieldKey: string): any {
    if (fieldKey === 'hidden') {
      // Специальная логика для получения состояния чекбокса "скрыто"
      const classes: string[] = (this.formData().gridClasses as string[]) || [];
      return classes.includes('hidden');
    }

    if (fieldKey === 'gridClasses') {
      // Возвращаем gridClasses без служебного класса 'hidden'
      const classes: string[] = (this.formData().gridClasses as string[]) || [];
      return classes.filter((c) => c !== 'hidden').join(' ');
    }

    return (this.formData() as any)[fieldKey];
  }

  hasGroupChanges(group: BasicSettingsGroup): boolean {
    const currentData = this.formData() as any;
    const originalData = this.value() as any;

    return group.fields.some(
      (field) =>
        JSON.stringify(currentData[field.key]) !==
        JSON.stringify(originalData[field.key]),
    );
  }

  getFieldError(field: BasicSettingField): string | null {
    // Не показываем ошибки до полной инициализации компонента
    if (!this.isInitialized()) {
      return null;
    }

    const value = this.getFieldValue(field.key);

    // Проверка обязательности заполнения
    if (
      field.required &&
      (value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === ''))
    ) {
      return 'Это поле обязательно для заполнения';
    }

    // Валидация числовых полей
    if (field.type === 'number' && value !== undefined && value !== null) {
      if (field.min !== undefined && value < field.min) {
        return `Минимальное значение: ${field.min}`;
      }
      if (field.max !== undefined && value > field.max) {
        return `Максимальное значение: ${field.max}`;
      }
    }

    return null;
  }
}
