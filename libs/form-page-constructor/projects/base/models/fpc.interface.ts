export interface FpcInterface {
  options?: FpcOptionInterface;
  template?: FpcInputsInterface[];
  templateOnOtherEmployees?: FpcInputsInterface[];
  data?: unknown | any;
  FullName?: string;
}

export interface FpcOptionInterface {
  changeStrategy?: 'pool' | 'push';
  appearanceElements?: 'fill' | 'standard' | 'outline' | 'legacy';
  editMode?: boolean;
  viewMode?: 'edit' | 'show';
  staticInfo?: string[];
  loadFileType?: 'base64';
  submitDebounceTime?: number;
  hideShowEmptyField?: boolean;
  showProfileButton?: boolean;
  staticText?: string[];
  onlyChanges?: boolean;
  markRequired?: boolean;
  insuranceCalculator?: boolean;
  hideAddButton?: boolean;
  showVacationBalance?: boolean;
}

export interface BoundaryMathDay {
  type: 'day' | 'month' | 'year';
  // -2 - начало предпредыдущего месяца
  // -1 - начало предыдущего месяца
  // 0 - начало текущего месяца,
  // 1 - конец текущего,
  // 2 - конец следующего месяца
  count?: number;
  excluded?: DaysType[];
  specificDate?: string;
}

export type FpcInputType =
  | 'static'
  | 'computed-static'
  | 'text'
  | 'password'
  | 'number'
  | 'hidden'
  | 'timepicker'
  | 'datepicker'
  | 'datepicker-month'
  | 'datepicker-year'
  | 'datepicker-range-start'
  | 'datepicker-range-end'
  | 'file'
  | 'file-multi'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'ref'
  | 'select'
  | 'select-employee'
  | 'select-filter'
  | 'select-multi'
  | 'arr-smart'
  | 'static-files';
export interface DefaultArrSmartControllerOptions {}

export interface BusinessTripDayoffsArrSmartControllerOptions {
  dateStartControl?: string;
  dateEndControl?: string;
  dayControl?: string;
  compensationTypeControl?: string;
  compensationDayOffControl?: string;
  dayTypeSource?: 'daysOff';
}

export type ArrSmartControllerOptions =
  | DefaultArrSmartControllerOptions
  | BusinessTripDayoffsArrSmartControllerOptions
  | Record<string, unknown>;

export type ArrSmartControllerName =
  | 'default'
  | 'businessTripDayoffs'
  | (string & {});

export interface ArrSmartControllerConfig {
  name: ArrSmartControllerName;
  options?: ArrSmartControllerOptions;
}

export interface FpcInputsInterface {
  type: FpcInputType;
  formControlName?: string;
  label?: string;
  value?: string | boolean | string[] | number;
  placeholder?: string;
  optionList?: FpcOptionListItemInterface[] | OptionListItemInterface[];
  optionListRequestAlias?: string; // параметр для получения опций с бэка
  selectMultiple?: boolean;
  selectParentTree?: boolean;
  gridClasses?: string[];
  validations?: ValidationTypes[0][];
  // todo errorMessage is deprecated, please use errorMessages
  errorMessage?: string;
  errorMessages?: Record<string, string>;
  hintMessage?: string;
  icon?: { name: string; clearMode: boolean };
  disabled?: boolean;
  edited?: boolean;
  arrSmartList?: FpcInputsInterface[];
  startDateControl?: string;
  dateBeginOptionListName?: string;
  dateEndOptionListName?: string;
  endDateControl?: string;
  startDateMathDay?: number | BoundaryMathDay;
  endDateMathDay?: number | BoundaryMathDay;
  availableDays?: (string | number)[];
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
  arrSmartController?: ArrSmartControllerConfig;
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
  hideOptions?: boolean;
  /**
   * Массив имён контролов, из которых берётся максимальная дата для установки минимального значения.
   * Используется для вычисления наиболее поздней даты из нескольких полей.
   * @example ['dateControl1', 'dateControl2']
   */
  minDateFromMaxOfControls?: string[];
  /**
   * Смещение в днях от вычисленной максимальной даты (по умолчанию 1).
   * Применяется вместе с minDateFromMaxOfControls.
   * @example 1 - следующий день после максимальной даты
   */
  minDateOffset?: number;
  /**
   * Если true, то максимальная дата будет равна минимальной,
   * что ограничивает выбор только одной конкретной датой.
   * Используется вместе с minDateFromMaxOfControls.
   */
  fixedDateFromControls?: boolean;
  /**
   * Если true, автоматически устанавливает значение поля
   * при изменении связанных полей (указанных в minDateFromMaxOfControls).
   */
  autoSetValueFromControls?: boolean;
}

export interface OptionListRequestParamsInterface {
  control: string;
  name: string;
  condition?: { control: string; condition: string };
  secondControl?: string;
}

export interface DependentFieldInterface {
  control: string;
  condition?: string;
  clone?: boolean;
}

export interface AddictedFieldInterface {
  parentArrayName?: string;
  controlName: string;
  fields: string[];
  bufferedValue?: any;
  condition?: string;
  clone?: boolean;
  initOnly?: boolean;
}

export interface StaticFilesInterface {
  fileDescription: string;
  fileID: string;
  fileLink: string;
  fileName: string;
  fileType: string;
  reqScript?: string;
}

export interface ValidationTypes {
  [x: number]:
    | 'required'
    | 'dynamic-required'
    | 'email'
    | { min: number }
    | { max: number }
    | { minLength: number }
    | { maxLength: number }
    | { pattern: string }
    | { syncWorkSchedule: 'dayoff' | 'workday' | number[] };
}

export interface FpcOptionListItemInterface {
  title: string;
  value: string;
  parentId?: string;
  level?: number;
}

export interface OptionListsByAliases {
  [key: string]: OptionListInterface;
}

export interface OptionListInterface {
  optionList: OptionListItemInterface[];
}

export interface OptionListItemInterface {
  optionID?: number;
  representation?: string;
  value: string;
  flag?: null;
  title?: string;
  dateBegin?: string;
  dateEnd?: string;
}

export interface DaysOffInterface {
  [key: string]: DaysType;
}

export type DaysType = 'workDay' | 'dayOff' | 'holiday';
