# Issue Template Builder Field Settings

Компонент для настройки полей форм в конструкторе шаблонов заявок. Предоставляет пользовательский интерфейс для редактирования всех свойств полей в соответствии с интерфейсом `FpcInputsInterface`.

## Архитектура

Компонент состоит из нескольких слоев:

### 1. Основной компонент (`IssueTemplateBuilderFieldSettingsComponent`)

- Модальное окно с настройками поля
- Принимает на входе: `fieldType` и `value` (Partial<FpcInputsInterface>)
- Возвращает: `save` event с полной моделью поля
- Обрабатывает анимации открытия/закрытия

### 2. Форма настроек (`FieldSettingsFormComponent`)

- Основная логика разделения настроек по секциям
- Управление состоянием формы и отслеживание изменений
- Переключение между секциями настроек
- Поддержка трех уровней сложности: basic, advanced, expert

### 3. Редакторы по секциям

#### BasicSettingsEditorComponent

Основные настройки поля, сгруппированные по категориям:

**Отображение:**

- `formControlName` - имя поля для обработки данных
- `label` - название поля в интерфейсе
- `placeholder` - подсказка в поле ввода
- `hintMessage` - подсказка под полем
- `value` - значение по умолчанию

**Поведение:**

- `disabled` - заблокировано ли поле
- `edited` - доступно ли для редактирования
- `autoSelectFirst` - автовыбор первого элемента в select
- `selectMultiple` - множественный выбор
- `selectParentTree` - иерархический список
- `onlyFirst` - блокировка кроме первого (для arr-smart)

**Форматирование:**

- `mask` - маска ввода
- `format` - формат даты (dd.mm.yyyy, mm.yyyy, yyyy)

**Настройки файлов:**

- `fileTypesAccept` - допустимые типы файлов

**Настройки arr-smart:**

- `arrSmartOpened` - количество открытых элементов

**Ссылки и связи:**

- `startDateControl` / `endDateControl` - связанные поля дат
- `minReferenceDateControl` / `maxReferenceDateControl` - поля-ссылки дат
- `target` - цель ссылки

**Автоматическое вычисление даты:**

- `minDateFromMaxOfControls` - массив имён контролов для вычисления максимальной даты
- `minDateOffset` - смещение в днях от вычисленной даты (по умолчанию 1)
- `fixedDateFromControls` - фиксирует дату (min = max = вычисленная дата)
- `autoSetValueFromControls` - автоматически устанавливает значение поля

#### SelectOptionsEditorComponent

Настройки для полей с выбором опций (`select`, `select-multi`, `select-filter`, `radio`):

**Источники данных:**

- Ручной ввод (`optionList`)
- API запрос (`optionListRequestAlias`)
- Предустановленные списки

**Возможности:**

- Добавление/редактирование/удаление опций
- Drag & Drop для изменения порядка
- Автогенерация `value` из `label`
- Предустановленные списки (Да/Нет, Приоритет, Статус)

#### ValidationRulesEditorComponent

Полная поддержка всех типов валидации из документации:

**Базовые валидаторы:**

- `required` - обязательное поле
- `dynamic-required` - динамически обязательное
- `minLength` / `maxLength` - ограничения длины
- `min` / `max` - числовые ограничения
- `pattern` - регулярные выражения
- `email` - формат email

**Специальные валидаторы:**

- `filesType` - типы файлов
- `notEqual` - не равно указанному полю
- `needToBeChanged` - значение должно быть изменено
- `date` - ограничения по типу дня
- `workSchedule` / `syncWorkSchedule` - рабочие графики
- `periodsGap` - разрывы между периодами

**Предустановленные паттерны:**

- Только буквы, цифры, без кириллицы/латиницы
- Телефон, ИНН, СНИЛС

#### DateValidationEditorComponent

Специальные настройки для полей дат:

- Диапазоны дат (`startDateMathDay`, `endDateMathDay`)
- Ограничения рабочими/выходными днями
- Предустановленные диапазоны

## Поддерживаемые типы полей

Все типы из `FpcInputType`:

- `static`, `computed-static`
- `text`, `password`, `number`, `textarea`
- `checkbox`, `radio`
- `select`, `select-multi`, `select-filter`, `select-employee`
- `datepicker`, `datepicker-month`, `datepicker-year`
- `datepicker-range-start`, `datepicker-range-end`
- `timepicker`
- `file`, `file-multi`
- `arr-smart`
- `static-files`

## Модель данных

Компонент полностью соответствует интерфейсу `FpcInputsInterface` из `@wafpc/base/models/fpc.interface`:

```typescript
interface FpcInputsInterface {
  type: FpcInputType;
  formControlName?: string;
  label?: string;
  value?: string | boolean | string[] | number;
  placeholder?: string;
  optionList?: FpcOptionListItemInterface[] | OptionListItemInterface[];
  optionListRequestAlias?: string;
  selectMultiple?: boolean;
  selectParentTree?: boolean;
  gridClasses?: string[];
  validations?: ValidationTypes[0][];
  errorMessages?: Record<string, string>;
  hintMessage?: string;
  icon?: { name: string; clearMode: boolean };
  disabled?: boolean;
  edited?: boolean;
  arrSmartList?: FpcInputsInterface[];
  startDateControl?: string;
  endDateControl?: string;
  startDateMathDay?: number | BoundaryMathDay;
  endDateMathDay?: number | BoundaryMathDay;
  minReferenceDateControl?: string;
  maxReferenceDateControl?: string;
  mask?: string;
  fileTypesAccept?: string;
  files?: StaticFilesInterface[];
  requiredToFill?: string[];
  dependent?: DependentFieldInterface[];
  onlyFirst?: boolean;
  optionListRequestParams?: OptionListRequestParamsInterface[];
  arrSmartOpened?: number;
  initCopyFrom?: string;
  dateHighlightType?: 'common' | 'schedule' | 'none';
  autoSelectFirst?: boolean;
  format?: string;
  requiredWorkday?: boolean;
  target?: '_blank' | '_self';
  computedStaticDateControls?: {
    dateBeginControl: string;
    dateEndControl: string;
  };
  minDateFromMaxOfControls?: string[];
  minDateOffset?: number;
  fixedDateFromControls?: boolean;
  autoSetValueFromControls?: boolean;
}
```

### Пример: Автоматическое вычисление даты на основе максимума из двух полей

Для создания поля, которое автоматически вычисляет дату как следующий день после наиболее поздней из двух дат:

```typescript
// Поле "Дата начала продления отпуска"
{
  type: 'datepicker',
  formControlName: 'vacationExtensionStartDate',
  label: 'Дата начала продления отпуска',
  edited: true,
  // Массив контролов, из которых берётся максимальная дата
  minDateFromMaxOfControls: ['sickLeaveEndDate', 'vacationEndDate'],
  // Смещение в днях (по умолчанию 1)
  minDateOffset: 1,
  // Фиксирует дату (пользователь не может выбрать другую)
  fixedDateFromControls: true,
  // Автоматически устанавливает значение при изменении связанных полей
  autoSetValueFromControls: true
}
```

Пример работы:
- Если `sickLeaveEndDate` = 28.01.2025 и `vacationEndDate` = 26.01.2025, 
  то поле установится в 29.01.2025 (максимум + 1 день)
- Если `sickLeaveEndDate` = 23.01.2025 и `vacationEndDate` = 29.01.2025, 
  то поле установится в 30.01.2025

## Использование

```typescript
<app-issue-template-builder-field-settings
  [fieldType]="'text'"
  [value]="fieldConfig"
  (save)="onFieldSave($event)"
  (close)="onFieldClose()"
/>
```

## Планы развития

- [+] Реализация редактора зависимостей полей (`dependent`)
- [ ] Редактор для `arrSmartList` (вложенные поля)
- [ ] Визуальный редактор CSS классов (`gridClasses`)
- [ ] Импорт/экспорт конфигураций полей
- [ ] Валидация конфигураций полей
- [ ] Автодополнение для зависимых полей

## Технические требования

- Angular 17+
- PrimeNG для UI компонентов
- Signals API для реактивности
- TypeScript в strict mode

## Стиль кода

- Используется новый синтаксис Angular 17 (control flow, signals)
- Input/Output signals для компонентов
- Standalone компоненты
- Строгая типизация TypeScript
