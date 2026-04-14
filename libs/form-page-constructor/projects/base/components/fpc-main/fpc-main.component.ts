import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, pairwise, Subject, SubscriptionLike } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  startWith
} from 'rxjs/operators';
import { DynamicAlias } from '../../classes/dynamic-alias.class';
import { Dynamic } from '../../classes/dynamic.class';
import {
  FpcArrSmartController,
  IFpcArrSmartControllerInit,
} from '../../controllers/shared';
import { FileBase64 } from '../../models/files.interface';
import {
  BoundaryMathDay,
  FpcInputsInterface,
  FpcInterface,
  FpcOptionListItemInterface,
  OptionListItemInterface,
  OptionListsByAliases,
} from '../../models/fpc.interface';
import { DaysOffService } from '../../services/days-off.service';
import { LocaleService } from '../../services/locale.service';
import { ArrSmartControllerService } from '../../services/arr-smart-controller.service';
import { getDefaultControlValue, getDefaultPresetValue, isDatepickerLike } from '../../utils/common';
import { isDateInvalid } from '../../utils/is-date-invalid.util';
import { isNil } from '../../utils/is-nil.utils';
import { getOffsetDate } from '../../utils/math-days-offset.util';
import { getObjDifference } from '../../utils/obj-difference.util';
import { ValidatorsUtils } from '../../utils/validators.utils';
import moment from 'moment';
import 'moment/locale/ru'

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    template: '',
    standalone: false
})
export class FpcMainComponent implements OnInit, OnChanges, OnDestroy {
  form: UntypedFormGroup;

  arrSmartItem: Record<string, FpcInputsInterface> = {};

  events: string[] = [];

  paddingLeft = 25;

  formStatuses = {};

  controlsFilterOptionList = {};

  notFilledText = '-- Not filled --';

  Object = Object;

  initialState = {};

  newCollection = [];

  private sub: SubscriptionLike;

  private destroy$ = new Subject<void>();

  private bufferedDisabled = new Set<string>();

  private arrSmartControllerService = inject(ArrSmartControllerService, {
    optional: true,
  });

  private arrSmartControllers: Record<string, FpcArrSmartController<unknown>> =
    {};

  private isArrSmartControllerSyncInProgress = false;

  @Input() formData: FpcInterface;

  @Input() set formData$(value: Observable<FpcInterface>) {
    if (value) {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
      this.dataSubscription = value
        .pipe(takeUntil(this.destroy$))
        .subscribe((formData): void => {
          this.updateFormData(formData);
          this.doAfterChanges();
        });
    }
  }

  @Output() formBuilt = new EventEmitter<UntypedFormGroup>();

  private dataSubscription: SubscriptionLike;

  @Input() set dateLocale(v: string) {
    this._dateLocale = v;
    this.localeService.setLocale(v);
  }

  private _dateLocale: string = 'ru';

  get dateLocale(): string {
    return this._dateLocale;
  }

  @Input() edit$: 'show' | 'edit';

  @Input() loading: boolean;

  @Input() submit$: Subject<void>;

  @Input() clear$: Subject<void>;

  @Input() hasInitialPatching!: boolean;

  @Input() set selectOptions(value: OptionListsByAliases) {
    this.optionLists = {
      ...this.optionLists,
      ...value,
    };
  }

  public optionLists: OptionListsByAliases = {};

  @Input() fileBase64: string | FileBase64;

  @Input() fileOpeningInProcess: boolean = false;

  @Input() staticData: Record<string, string | boolean | string[] | number>;

  @Input() staticDataManager: Record<string, string | boolean | string[] | number>;

  @Output() formSubmit = new EventEmitter();

  @Output() formSubmitFailed = new EventEmitter();

  @Output() getFile = new EventEmitter<string>();

  @Output() getStaticFile = new EventEmitter<string>();

  @Output() isInvalid = new EventEmitter<boolean>();

  @Output() showOptions = new EventEmitter<unknown[]>();

  @Output() valueChanged = new EventEmitter();

  @Output() employeeChanged = new EventEmitter<{
    employeeId: string;
    fields: string[];
  }>();

  private initialized = {
    submit: false,
    query: false,
    optionList: false,
    form: false,
    viewMode: false,
  };

  private unchangedValue: any;

  private addictedFields: Dynamic[] = [];

  private dynamicAliases: DynamicAlias[] = [];

  private bufferedValue: any = {};

  private parentId: string;

  aliasesMatch: any = {};

  constructor(
    protected fb: UntypedFormBuilder,
    protected validators: ValidatorsUtils,
    protected activatedRoute: ActivatedRoute,
    protected localeService: LocaleService,
    protected datePipe: DatePipe,
    @Optional() protected daysOffService: DaysOffService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.form &&
      changes.loading &&
      typeof changes.loading.currentValue === 'boolean'
    ) {
      if (this.loading) {
        Object.keys(this.form.controls).forEach((key) => {
          this.formStatuses[key] = this.form.get(key).status;
          this.form.get(key).disable({ emitEvent: false });
        });
      } else {
        Object.keys(this.form.controls).forEach((key) => {
          return this.formData.template.find((e) => {
            return e.formControlName === key;
          })?.disabled || this.bufferedDisabled.has(key)
            ? this.form.get(key).disable({ emitEvent: false })
            : this.form.get(key).enable({ emitEvent: false });
        });
      }
    }

    if (changes.fileBase64 && changes.fileBase64.currentValue) {
      this.openFileDialog(this.fileBase64);
    }

    if (changes.hasInitialPatching?.currentValue && this.form) {
      this.form.patchValue(this.form.value);
    }

    if (changes.submit$?.currentValue && !this.initialized.submit) {
      this.submit$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.onSubmit();
      });
      this.initialized.submit = true;
    }

    if (changes.formData?.currentValue) {
      this.doAfterChanges();
    }

    if (changes.staticData && changes.staticData.currentValue && this.formData) {
      this.updateDynamicValue();
    }
  }

  updateDynamicValue() {
    for (const item of this.formData.template) {
      if (item.arrSmartList) {
        for (const itemArrSmart of item.arrSmartList) {
          itemArrSmart.value = getDefaultPresetValue(itemArrSmart.value, this.staticData, this.staticDataManager)
        }
      } else if (item.value && typeof item.value === 'string' && item.value.includes('staticd') && this.form) {
        this.form.controls[item.formControlName].patchValue(getDefaultPresetValue(item.value, this.staticData, this.staticDataManager));
      }
    }
  }

  setAliasMatch(
    arrControlName: string,
    index: number,
    controlName: string,
    alias: string,
  ) {
    if (this.aliasesMatch[arrControlName]) {
      if (this.aliasesMatch[arrControlName][index]) {
        this.aliasesMatch[arrControlName][index][controlName] = alias;
      } else {
        this.aliasesMatch[arrControlName][index] = {};
        this.aliasesMatch[arrControlName][index][controlName] = alias;
      }
    } else {
      this.aliasesMatch[arrControlName] = [];
      this.aliasesMatch[arrControlName][index] = {};
      this.aliasesMatch[arrControlName][index][controlName] = alias;
    }
  }

  updateFormData(formData: FpcInterface): void {
    this.formData = formData;
    Dynamic.setFormData(formData);
  }

  private doAfterChanges(): void {
    if (this.formData && !this.initialized.query) {
      let queryParams = { ...this.activatedRoute.snapshot?.queryParams };
      let data = localStorage.getItem('issue_data')
        ? JSON.parse(localStorage.getItem('issue_data'))
        : null;
      setTimeout(() => {
        localStorage.removeItem('issue_data');
      }, 5000);
      this.parentId = data?.parentId;
      this.formData.data = Object.assign(
        this.formData.data || {},
        queryParams || {},
        data || {},
      );
      this.initialized.query = true;
    }
    if (this.formData?.template && !this.initialized.optionList) {
      const optionAliases = [];
      for (const el of this.formData.template) {
        if (el.arrSmartList) {
          for (const arrListEl of el.arrSmartList) {
            if (
              arrListEl.optionListRequestAlias &&
              !arrListEl.optionListRequestParams?.length
            ) {
              optionAliases.push(arrListEl.optionListRequestAlias);
            }
          }
        } else if (
          el.optionListRequestAlias &&
          !el.optionListRequestParams?.length
        ) {
          optionAliases.push(el.optionListRequestAlias);
        }
      }
      if (optionAliases?.length) {
        this.showOptions.emit(optionAliases);
      }
      this.initialized.optionList = true;
    }
    if (
      this.form &&
      this.formData &&
      this.formData.template &&
      this.formData.options &&
      !this.initialized.form
    ) {
      this.findDynamicDependencies(this.formData);
      this.formBuild();
      this.updateDynamicFields();
      this.rebuildDynamicAliases(this.form.getRawValue());
      this.initialized.form = true;
      if (
        !this.formData?.options?.editMode ||
        this.formData?.options?.viewMode === 'show'
      ) {
        for (const item of this.formData.template) {
          if (item.type === 'arr-smart') {
            this.form
              .getRawValue()
              [item.formControlName].forEach((arrItem, arrIndex) => {
                this.rebuildDynamicAliases(this.form.getRawValue(), arrIndex);
              });
          }
        }
      }
    }
    if (this.form && this.formData && this.edit$ && this.initialized.viewMode) {
      this.formData.options.viewMode = this.edit$;
      this.initialized.viewMode = true;
    }
    if (this.form?.value.contacts) {
      this.initialState = JSON.parse(JSON.stringify(this.form.value));
    }
    if (this.formData?.options?.onlyChanges && this.formData?.data) {
      this.unchangedValue = this.formData?.data;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
    if (this.form && this.formData && Object.keys(this.formData).length) {
      this.findDynamicDependencies(this.formData);
      this.formBuild();
      this.updateDynamicFields();
      this.rebuildDynamicAliases(this.form.getRawValue());
    }
    if (this.clear$) {
      this.clear$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.onClear();
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.arrSmartControllers = {};
  }

  formBuild(): void {
    const newForm: UntypedFormGroup = this.fb.group({});
    this.arrSmartItem = {};

    for (const item of this.formData.template) {
      if (item.formControlName) {
        newForm.addControl(
          item.formControlName,
          this.getControlType(item, newForm),
        );
        newForm
          .get(item.formControlName)
          .setValidators(this.validators.getList(item, newForm) ?? []);
        newForm
          .get(item.formControlName)
          .setAsyncValidators(this.validators.getAsyncList(item) ?? []);
      }
    }
    this.form = newForm;
    if (this.formData.data) {
      this.patchValueControlType(
        this.formData.data as FpcInterface,
        this.formData.template,
      );
    }

    this.initArrSmartControllers();
    this.syncArrSmartControllers();

    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.form.valueChanges
      .pipe(
        debounceTime(
          typeof this.formData.options?.submitDebounceTime === 'number'
            ? this.formData.options?.submitDebounceTime
            : 200,
        ),
        distinctUntilChanged((a, b) => {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          let updA: any = {};
          let updB: any = {};
          if (keysA.length <= keysB.length) {
            updB = this.mapEmpties(b);
            updA = {
              ...this.clearValues(b),
              ...this.mapEmpties(a),
            };
          } else {
            updA = this.mapEmpties(a);
            updB = {
              ...this.clearValues(a),
              ...this.mapEmpties(b),
            };
          }
          return JSON.stringify(updA) === JSON.stringify(updB);
        }),
        takeUntil(this.destroy$),
        startWith(null),
        pairwise(),
        map(([oldState, newState]) => {
          let indexOfChangedArrayItem: number;
          for (const key in newState) {
            if (
              Array.isArray(newState[key]) &&
              newState[key].length &&
              oldState &&
              oldState[key] &&
              oldState[key].length &&
              newState[key].length === oldState[key].length &&
              typeof newState[key][0] !== 'string'
            ) {
              newState[key].forEach((arrayField, index) => {
                if (!this.deepEqual(arrayField, oldState[key][index])) {
                  indexOfChangedArrayItem = index;
                }
              });
            }
          }
          return indexOfChangedArrayItem;
        }),
      )
      .subscribe((indexOfChangedArrayItem) => {
        this.syncArrSmartControllers();
        this.isInvalid.emit(this.form.invalid);
        this.updateDynamicFields();
        this.rebuildDynamicAliases(
          this.form.getRawValue(),
          indexOfChangedArrayItem,
        );
        this.valueChanged.emit(this.form);
        if (this.formData.options?.submitDebounceTime) {
          this.onSubmit();
        }
      });

    // it's required to update dependent controls dynamically
    Dynamic.setBufferDisabled(this.bufferedDisabled);
    Dynamic.setForm(this.form);
    Dynamic.setFormData(this.formData);

    this.formBuilt.emit(this.form);
  }

  deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (
      obj1 == null ||
      typeof obj1 !== 'object' ||
      obj2 == null ||
      typeof obj2 !== 'object'
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  canAddSmartItem(name?: string | null): boolean {
    if (!name) {
      return true;
    }
    const controller = this.arrSmartControllers[name];
    return controller ? controller.canAddItems() : true;
  }

  canRemoveSmartItem(name?: string | null): boolean {
    if (!name) {
      return true;
    }
    const controller = this.arrSmartControllers[name];
    return controller ? controller.canRemoveItems() : true;
  }

  private initArrSmartControllers(): void {
    this.arrSmartControllers = {};

    if (!this.arrSmartControllerService || !this.formData?.template?.length) {
      return;
    }

    for (const field of this.formData.template) {
      if (
        field.type !== 'arr-smart' ||
        !field.formControlName ||
        !this.form.get(field.formControlName)
      ) {
        continue;
      }

      const controllerName = field.arrSmartController?.name ?? 'default';
      const controller = this.arrSmartControllerService.createController(
        controllerName,
        this.buildArrSmartControllerInit(field),
      );
      controller.init();
      this.arrSmartControllers[field.formControlName] = controller;
    }
  }

  private buildArrSmartControllerInit(
    field: FpcInputsInterface,
  ): IFpcArrSmartControllerInit {
    return {
      field,
      form: this.form,
      template: this.formData.template,
      getArrayControl: (arrControlName: string) => {
        const control = this.form.get(arrControlName);
        return control instanceof UntypedFormArray ? control : null;
      },
      createSmartFormGroup: (arrControlName: string, length: number) =>
        this.smartFormGroup(arrControlName, length),
      replaceArrayItems: (arrControlName: string, groups: UntypedFormGroup[]) =>
        this.replaceArrayItems(arrControlName, groups),
      toDateKey: (date: unknown) => this.toDateKey(date),
      getDaysOffMap: () => this.daysOffService?.daysOff ?? {},
    };
  }

  private syncArrSmartControllers(): void {
    if (this.isArrSmartControllerSyncInProgress) {
      return;
    }

    this.isArrSmartControllerSyncInProgress = true;
    try {
      for (const controller of Object.values(this.arrSmartControllers)) {
        controller.updateForm(this.form);
      }
    } finally {
      this.isArrSmartControllerSyncInProgress = false;
    }
  }
  // getChangedField(form: any) {
  //   let dirtyValues = {};
  //
  //   Object.keys(form.controls)
  //     .forEach(key => {
  //       let currentControl = form.controls[key];
  //
  //       if (currentControl.dirty) {
  //         if (currentControl.controls)
  //           dirtyValues[key] = this.getDirtyValues(currentControl);
  //         else
  //           dirtyValues[key] = currentControl.value;
  //       }
  //     });
  //
  //   return dirtyValues;
  // }

  getControlType(
    item: FpcInputsInterface,
    form: UntypedFormGroup,
  ): UntypedFormControl | UntypedFormArray {
    switch (item.type) {
      case 'arr-smart':
        if (item.formControlName) {
          this.arrSmartItem[item.formControlName] = item;
        }
        return this.fb.array([]);
      default:
        return this.fb.control(
          {
            value:
              isDatepickerLike(item.type) ? typeof item.value === 'string' ? this.getUnzonedDate(item.value) : item.value || '' : getDefaultPresetValue(item.value, this.staticData, this.staticDataManager) || getDefaultControlValue(item.type),
            disabled: !!item.disabled,
          },
        );
    }
  }

  patchValueControlType(
    data: FpcInterface,
    template: FpcInputsInterface[],
  ): void {
    for (const name of Object.keys(data)) {
      const currentTemplate = template.find(
        (temp) => temp.formControlName === name,
      );
      if (
        this.form.get(name) &&
        !isNil(this.formData.data[name]) &&
        currentTemplate
      ) {
        switch (
          Array.isArray(this.formData.data[name]) &&
          !this.isSelectMultiple(name) &&
          !this.isFilesArray(currentTemplate)
        ) {
          case true: {
            const arrayControl: UntypedFormArray = this.form.get(
              name,
            ) as UntypedFormArray;
            const currentArrayTemplate = currentTemplate.arrSmartList;
            for (const obj of this.formData.data[name]) {
              if (this.arrSmartItem[name]) {
                const formGroup: UntypedFormGroup = this.smartFormGroup(
                  name,
                  arrayControl.length,
                );
                for (const nameObj of Object.keys(obj)) {
                  const templateType = currentArrayTemplate?.find(
                    (item) => item.formControlName === nameObj,
                  )?.type;
                  const arrValObj = {};
                  arrValObj[nameObj] = obj[nameObj];
                  if (isDatepickerLike(templateType)) {
                    arrValObj[nameObj] = this.getUnzonedDate(obj[nameObj]);
                  }
                  formGroup.patchValue(arrValObj);
                }
                arrayControl.push(formGroup);
              }
            }
            break;
          }
          case false: {
            const valObj = {};
            valObj[name] = this.formData.data[name];
            if (isDatepickerLike(currentTemplate.type)) {
              valObj[name] = this.getUnzonedDate(this.formData.data[name]);
            }
            if (this.isSelectMultiple(name)) {
              valObj[name] = !Array.isArray(valObj[name])
                ? [valObj[name]]
                : valObj[name];
            }
            this.form.patchValue(valObj);
            break;
          }
          default:
            break;
        }
      }
    }
  }

  isSelectMultiple(name: string): boolean {
    return !!this.formData.template.find((e) => e.formControlName === name)
      ?.selectMultiple;
  }

  isFilesArray(currentTemplate: FpcInputsInterface): boolean {
    return currentTemplate.type.includes('file');
  }

  smartFormGroup(name: string, length: number): UntypedFormGroup {
    // Необходимо, чтоб заблокировать поле в следующих группах
    const onlyFirst =
      this.formData.template
        ?.find((data) => data.formControlName === name)
        ?.arrSmartList // @ts-ignore
        ?.filter((item) => item.onlyFirst)
        ?.map((item) => item.formControlName) || [];

    const formGroup = this.fb.group({});
    for (const control of this.arrSmartItem[name].arrSmartList) {
      formGroup.addControl(
        control.formControlName,
        this.fb.control(
          {
            value: control.value ?? getDefaultControlValue(control.type),
            disabled:
              !!control.disabled ||
              (onlyFirst.includes(control.formControlName) && length),
          },
          this.validators.getList(control, formGroup),
          this.validators.getAsyncList(control),
        ),
      );
    }
    return formGroup;
  }

  private replaceArrayItems(
    arrControlName: string,
    groups: UntypedFormGroup[],
  ): void {
    const arrayControl = this.form.get(arrControlName);
    if (!(arrayControl instanceof UntypedFormArray)) {
      return;
    }

    while (arrayControl.length) {
      (arrayControl as any).removeAt(arrayControl.length - 1, {
        emitEvent: false,
      });
    }

    groups.forEach((group) => {
      (arrayControl as any).push(group, { emitEvent: false });
    });

    arrayControl.updateValueAndValidity({ emitEvent: false });
  }

  private toDateKey(date: unknown): string | null {
    if (!date) {
      return null;
    }

    const parsed = date instanceof Date ? date : new Date(date as any);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const year = parsed.getUTCFullYear();
    const month = `${parsed.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${parsed.getUTCDate()}`.padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  isDateInvalid(date: Date | string): boolean {
    return isDateInvalid(date);
  }

  dateBinding(formControlName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const separator = target.value.indexOf('.') > -1 ? '.' : '/';
    const ds = target.value.split(separator).map((i) => parseInt(i, 10));
    const newDate =
      separator === '.'
        ? this.getUnzonedDate(new Date(ds[2], ds[1] - 1, ds[0]))
        : this.getUnzonedDate(new Date(ds[2], ds[0] - 1, ds[1]));
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    this.form.patchValue({ [formControlName]: newDate.toISOString() });
  }

  mathCurrentDateDay(
    value: number | BoundaryMathDay,
    reference: Date | string = new Date(),
  ): string {
    return getOffsetDate({
      value,
      reference,
      daysOff: this.daysOffService?.daysOff,
    });
  }

  getOptionListValue(optionListName: string) {
    const formControlName = this.formData?.template.find(item => item.optionListRequestAlias === optionListName).formControlName;
    const value = this.form.get(formControlName).value;
    return !value ? null : this.optionLists[optionListName].optionList.find(list => list.value === value);
  }

  getDateByString(dateString: string): Date {
    const parts = dateString.split(".");
    const day = +parts[0];
    const month = +parts[1] - 1;
    const year = +parts[2];
    return new Date(year, month, day, 23);
  }

  valueBinding(formControlName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const obj = {};
    obj[formControlName] = target.value;
    this.form.patchValue(obj);
  }

  fileProcessing(
    formControlName: string,
    fileDescription: string,
    event: Event,
    loadType: string,
  ): void {
    const target = event.target as HTMLInputElement;
    const getBase64 = (f: Blob | File): Promise<string | ArrayBuffer> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    switch (loadType) {
      case 'base64':
      default: {
        const formControlValue = [];
        for (const ind of Object.keys(target.files)) {
          getBase64(target.files[ind]).then((file64) => {
            const valObj = {};
            const fileName = target.files[ind].name;
            const fileObj = { fileName, file64, fileDescription };
            formControlValue.push(fileObj);
            valObj[formControlName] = formControlValue;
            this.form.patchValue(valObj);
          });
        }
        break;
      }
    }
  }

  filterOptionList(formControlName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const { optionList } = this.formData.template.find(
      (e) => e.formControlName === formControlName,
    );
    this.controlsFilterOptionList[formControlName] = optionList.slice();
    this.controlsFilterOptionList[formControlName] =
      this.controlsFilterOptionList[formControlName].filter((el) => {
        return el.title.toLowerCase().indexOf(target.value.toLowerCase()) > -1;
      });
  }

  reloadFilterOptionList(formControlName: string): void {
    this.controlsFilterOptionList[formControlName] =
      this.formData.template.find(
        (e) => e.formControlName === formControlName,
      ).optionList;
  }

  filterOptionListAlias(
    formControlName: string,
    optionListRequestAlias: string,
    event: Event,
  ): void {
    const target = event.target as HTMLInputElement;
    const { optionList } = this.optionLists[optionListRequestAlias];
    this.controlsFilterOptionList[formControlName] = optionList.slice();
    this.controlsFilterOptionList[formControlName] =
      this.controlsFilterOptionList[formControlName].filter((el) => {
        return (
          el.representation.toLowerCase().indexOf(target.value.toLowerCase()) >
          -1
        );
      });
  }

  reloadFilterOptionListAlias(
    formControlName: string,
    optionListRequestAlias: string,
  ): void {
    this.controlsFilterOptionList[formControlName] =
      this.optionLists[optionListRequestAlias].optionList;
  }

  showSelectItem(
    value: string | number | boolean | string[],
    list: OptionListItemInterface[],
  ): string {
    if (Array.isArray(value)) {
      const items = list?.filter((e) => value.includes(e.value));
      if (items?.length) {
        return items.map((e) => e.title || e.representation).join(', ');
      }
    } else {
      const item = list?.find((e) => e.value === value);
      if (item) {
        return item.title || item.representation;
      }
    }
    return '';
  }

  addSmartFormGroup(name: string): void {
    if (!this.canAddSmartItem(name)) {
      return;
    }

    const arrayControl: UntypedFormArray = this.form.get(
      name,
    ) as UntypedFormArray;
    const formGroup = this.smartFormGroup(name, arrayControl.length);
    arrayControl.push(formGroup);
  }

  removeSmartFormGroup(name: string, index: number): void {
    if (!this.canRemoveSmartItem(name)) {
      return;
    }

    this.onArrSmartItemRemoved(name, index);

    const arrayControl: UntypedFormArray = this.form.get(
      name,
    ) as UntypedFormArray;
    arrayControl.controls.splice(index, 1);
  }

  protected onArrSmartItemRemoved(name: string, index: number): void {
    const controller = this.arrSmartControllers[name];
    if (!controller) {
      return;
    }

    const arrayControl = this.form.get(name) as UntypedFormArray;
    const control = arrayControl?.at(index) as UntypedFormGroup;
    if (!control) {
      return;
    }

    controller.removeItem(control.getRawValue());
  }

  onSubmit(): void {
    this.markAsTouched(this.form);
    console.log('[fpc-main.component.ts] onSubmit -> form: ', this.form);
    this.isInvalid.emit(this.form.invalid);

    if (this.form.invalid) {
      this.formSubmitFailed.emit({ form: this.form });
    }

    if (
      this.form.valid ||
      (this.form.status === 'DISABLED' && !this.form.invalid)
    ) {
      this.clearHiddenDependentFields();
      let modifiedValue = this.getFilteredRawValue(this.form);
      if (this.form.controls.contacts) {
        modifiedValue = this.filterUnmodifiedContacts();
      } else if (this.formData.options?.onlyChanges) {
        modifiedValue = getObjDifference(this.unchangedValue, modifiedValue);
      }
      modifiedValue = this.mapDates(modifiedValue);

      if (this.parentId) {
        this.formSubmit.emit({ ...modifiedValue, parentId: this.parentId });
      } else {
        this.formSubmit.emit(modifiedValue);
      }
    }
  }

  clearHiddenDependentFields(): void {
    const templates: FpcInputsInterface[] = this.formData.template;
    const templatesWithDependencies: FpcInputsInterface[] = templates.filter(
      (t) => t.dependent?.length,
    );
    // console.log(`templatesWithDependencies`, templatesWithDependencies);

    for (const field in this.form.controls) {
      // 'field' is a string
      const fieldTemplate: FpcInputsInterface = templatesWithDependencies.find(
        (t) => t.formControlName === field,
      );
      if (!fieldTemplate) continue;

      // управляющее поле
      const masterControl = this.form.get(field); // 'masterControl' is a FormControl
      // console.groupCollapsed('dependency');
      // console.log(`[master] ${field}:`, masterControl);

      // проходим по объектам, содержащим данные зависимых полей в шаблоне управляющего поля
      for (const dependent of fieldTemplate.dependent) {
        const dependentControlName: string = dependent.control;
        const dependentControl = this.form.get(dependentControlName);

        if (!dependentControl) continue;

        // console.log(`[dependent] ${dependentControlName}:`, dependentControl);

        // очищаем значения зависимых полей, если они скрыты или скрыто управляющее ими поле
        if (
          (dependentControl as any)?.hidden ||
          (masterControl as any)?.hidden
        ) {
          if (dependentControl instanceof FormArray) {
            dependentControl.clear();
          } else {
            dependentControl.setValue('', { emitEvent: false });
          }
        }
      }
      // console.groupEnd();
    }
  }

  private markAsTouched(group: UntypedFormGroup | UntypedFormArray): void {
    let controls = Array.isArray(group.controls)
      ? group.controls
      : Object.values(group.controls);
    for (const control of controls) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();

      if (this.isFormGroupOrArray(control)) {
        this.markAsTouched(control);
      }
    }
  }

  private isFormGroupOrArray(
    obj: AbstractControl,
  ): obj is UntypedFormArray | UntypedFormGroup {
    if ('controls' in obj) {
      return true;
    }
    return false;
  }

  onClear(): void {
    for (const controlName of Object.keys(this.form.controls)) {
      this.form.get(controlName).patchValue('');
    }
  }

  viewMode(value: 'edit' | 'show'): void {
    this.formData.options.viewMode = value;
  }

  openFile(id: string): void {
    this.getFile.emit(id);
  }

  openFileDialog(fileBase64: string | FileBase64): void {
    throw new Error('not implemented in library');
  }

  filterUnmodifiedContacts(): { contacts: unknown[] } {
    const deleted = this.getDeletedFields();
    const changed = this.getChangedFields();
    return {
      contacts: [...changed, ...deleted],
    };
  }

  private getChangedFields(): unknown[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stringifiedContacts: unknown[] = this.initialState.contacts.map(
      (value) => JSON.stringify(value),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.form.controls.contacts.controls.reduce(
      (acc: unknown[], group: AbstractControl) => {
        const stringifiedValue = JSON.stringify(group.value);
        if (group.dirty && !stringifiedContacts.includes(stringifiedValue)) {
          acc.push(group.value);
        }
        return acc;
      },
      [],
    );
  }

  private getDeletedFields(): unknown[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const types: unknown[] = this.form.value.contacts.map(
      (value) => value.contactTypeID,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.initialState.contacts
      .filter((value) => !types.includes(value.contactTypeID))
      .map((value) => ({ ...value, contactValue: 'УДАЛЕНО' }));
  }

  openStaticFile(id: string): void {
    this.getStaticFile.emit(id);
  }

  normalizeOptionList(
    item: FpcOptionListItemInterface,
    collection: FpcOptionListItemInterface[],
  ): void {
    if (item.level !== 0) {
      this.newCollection.push(item);
    }
    const childs = collection.filter((e) => e.parentId === item.value);
    if (childs.length) {
      childs.forEach((i) => this.normalizeOptionList(i, collection));
    }
  }

  filterParentGroup(
    collection: FpcOptionListItemInterface[],
  ): FpcOptionListItemInterface[] {
    collection.forEach((item) => {
      if (
        item.level === 0 &&
        !this.newCollection?.find((i) => i.value === item.value)
      ) {
        this.newCollection.push(item);
        this.normalizeOptionList(item, collection);
      }
    });

    return [...this.newCollection];
  }

  protected getUnzonedDate(date: Date | string = ''): Date | null {
    let modDate = date;
    if (typeof date === 'string') {
      modDate = new Date(date || '');
    }
    if (!modDate || modDate?.toString() === 'Invalid Date') {
      modDate = new Date();
    }
    return new Date(
      Date.UTC(
        (modDate as Date).getFullYear(),
        (modDate as Date).getMonth(),
        (modDate as Date).getDate(),
      ),
    );
  }

  // TODO Заменить requiredToFill на dependent
  private findDynamicDependencies(value: FpcInterface): void {
    this.addictedFields = [];
    this.dynamicAliases = [];
    value.template.forEach((item) => {
      if (item.type === 'arr-smart') {
        item.arrSmartList.forEach((arrItem) => {
          if (arrItem.requiredToFill) {
            this.addictedFields.push(
              new Dynamic({
                controlName: arrItem.formControlName,
                parentArrayName: item.formControlName,
                fields: Array.isArray(arrItem.requiredToFill)
                  ? arrItem.requiredToFill
                  : [arrItem.requiredToFill],
              }),
            );
          }
          if (arrItem.dependent?.length) {
            arrItem.dependent.forEach((dependentItem) => {
              this.addictedFields.push(
                new Dynamic({
                  controlName: dependentItem.control,
                  parentArrayName: item.formControlName,
                  fields: [arrItem.formControlName],
                  condition: dependentItem.condition ?? undefined,
                  clone: dependentItem.clone ?? false,
                }),
              );
            });
          }
          if (arrItem.optionListRequestAlias && arrItem.formControlName) {
            this.dynamicAliases.push(
              new DynamicAlias({
                control: arrItem.formControlName,
                parent: item.formControlName,
                params: arrItem.optionListRequestParams,
                alias: arrItem.optionListRequestAlias,
                index: this.dynamicAliases.length,
              }),
            );
          }
        });
      } else {
        if (item.requiredToFill) {
          this.addictedFields.push(
            new Dynamic({
              controlName: item.formControlName,
              fields: Array.isArray(item.requiredToFill)
                ? item.requiredToFill
                : [item.requiredToFill],
            }),
          );
        }
        if (item.dependent?.length) {
          item.dependent.forEach((dependentItem) => {
            this.addictedFields.push(
              new Dynamic({
                controlName: dependentItem.control,
                fields: [item.formControlName],
                condition: dependentItem.condition ?? null,
                clone: dependentItem.clone ?? false,
              }),
            );
          });
        }
        if (item.optionListRequestParams) {
          this.dynamicAliases.push(
            new DynamicAlias({
              control: item.formControlName,
              params: item.optionListRequestParams,
              alias: item.optionListRequestAlias,
            }),
          );
        }
      }
    });
  }

  private updateDynamicFields(): void {
    this.addictedFields.forEach((item) => {
      item.update();
    });

    // Автоматическая установка даты для полей с minDateFromMaxOfControls
    this.updateAutoSetDateFields();
  }

  /**
   * Обновляет поля с автоматической установкой даты на основе максимальной даты из связанных контролов.
   */
  private updateAutoSetDateFields(): void {
    if (!this.formData?.template) {
      return;
    }

    for (const item of this.formData.template) {
      if (item.autoSetValueFromControls && item.minDateFromMaxOfControls?.length) {
        this.autoSetDateFromControls(item);
      }
    }
  }

  private rebuildDynamicAliases(formValue: any, index?: number): void {
    let modFormData = { ...this.formData };
    const aliases: string[] = [];
    this.dynamicAliases.forEach((dynamic) => {
      const [updatedFormData, alias, arrControl, controlName] = dynamic.update(
        formValue,
        modFormData,
        index,
      );
      modFormData = updatedFormData;
      if (alias) {
        aliases.push(alias);
      }
      // Для arr-smart всегда пишем resolved-алиас: при совпадении с прошлым update возвращает alias === ''
      // и иначе вторая строка с теми же параметрами не попадает в aliasesMatch
      if (arrControl && controlName && (index || index === 0)) {
        this.setAliasMatch(
          arrControl,
          index,
          controlName,
          dynamic.getResolvedAlias(),
        );
      }
    });
    if (aliases.length) {
      this.updateFormData(modFormData);
      this.showOptions.emit(aliases);
    }
  }

  private mapEmpties<T>(data: T): T {
    const keys = Object.keys(data);
    return keys.reduce((acc, key) => {
      acc[key] = data[key]?.length === 0 ? '' : data[key] || '';
      return acc;
    }, {}) as T;
  }

  private clearValues<T>(data: T): T {
    const keys = Object.keys(data);
    return keys.reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {}) as T;
  }

  private getFilteredRawValue(formGroup: UntypedFormGroup): any {
    let rawData = formGroup.getRawValue();
    let filteredData = {};

    for (let key of Object.keys(rawData)) {
      // Фильтруем динамически скрытые контролы
      // @ts-ignore
      if (!formGroup.get(key).hidden) {
        if (formGroup.get(key) instanceof UntypedFormGroup) {
          filteredData[key] = this.getFilteredRawValue(
            <UntypedFormGroup>formGroup.get(key),
          );
        } else if (formGroup.get(key) instanceof UntypedFormArray) {
          filteredData[key] = [];
          (<UntypedFormArray>formGroup.get(key)).controls.forEach(
            (control, i) => {
              if (control instanceof UntypedFormGroup) {
                filteredData[key].push(
                  this.getFilteredRawValue(<UntypedFormGroup>control),
                );
              }
            },
          );
        } else {
          filteredData[key] = rawData[key];
        }
      }
    }

    return filteredData;
  }

  private mapDates(raw: any): any {
    let filteredData = { ...raw };

    for (const value of this.formData.template) {
      if (isDatepickerLike(value.type) && value.format) {
        moment.locale(this._dateLocale);
        filteredData[value.formControlName] = moment(filteredData[value.formControlName]).format(value.format);
      } else if (value.type === 'arr-smart') {
        if (!filteredData[value.formControlName]?.length) continue;

        filteredData[value.formControlName] = filteredData[
          value.formControlName
        ].map((data) => {
          const modData = { ...data };
          for (const subValue of value.arrSmartList) {
            if (isDatepickerLike(subValue.type) && subValue.format) {
              modData[subValue.formControlName] = this.datePipe.transform(
                modData[subValue.formControlName],
                subValue.format,
              );
            }
          }
          return modData;
        });
      }
    }

    return filteredData;
  }

  getDatepickerMin(item: FpcInputsInterface): string | Date {
    // Если указаны контролы для вычисления максимальной даты
    if (item.minDateFromMaxOfControls?.length) {
      return this.getDateFromMaxOfControls(item);
    }

    return this.form.get(item.startDateControl)?.value
                ? this.form.get(item.startDateControl)?.value
                : item.startDateMathDay || item.startDateMathDay === 0
                  ? this.mathCurrentDateDay(
                      item.startDateMathDay,
                      this.form.get(item.minReferenceDateControl)?.value
                    )
                  : item.dateBeginOptionListName && this.getOptionListValue(item.dateBeginOptionListName) ?
                   this.getDateByString(this.getOptionListValue(item.dateBeginOptionListName).dateBegin) : ''
  }

  getDatepickerMax(item: FpcInputsInterface): string | Date {
    // Если указана фиксированная дата из контролов, то max = min
    if (item.fixedDateFromControls && item.minDateFromMaxOfControls?.length) {
      return this.getDateFromMaxOfControls(item);
    }

    return item.endDateMathDay || item.endDateMathDay === 0
    ? this.mathCurrentDateDay(
        item.endDateMathDay,
        this.form.get(item.maxReferenceDateControl)?.value
      )
    : item.dateEndOptionListName && this.getOptionListValue(item.dateEndOptionListName) ?
     this.getDateByString(this.getOptionListValue(item.dateEndOptionListName).dateEnd) : ''

  }

  /**
   * Вычисляет дату на основе максимальной даты из указанных контролов.
   * @param item - конфигурация поля
   * @returns дата (максимальная + смещение) или пустая строка
   */
  getDateFromMaxOfControls(item: FpcInputsInterface): string | Date {
    if (!item.minDateFromMaxOfControls?.length) {
      return '';
    }

    const dates: Date[] = [];
    for (const controlName of item.minDateFromMaxOfControls) {
      const value = this.form.get(controlName)?.value;
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      }
    }

    if (dates.length === 0) {
      return '';
    }

    // Находим максимальную дату
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Добавляем смещение (по умолчанию 1 день)
    const offset = item.minDateOffset ?? 1;
    maxDate.setDate(maxDate.getDate() + offset);

    return maxDate;
  }

  /**
   * Автоматически устанавливает значение поля на основе максимальной даты из связанных контролов.
   * Вызывается при изменении связанных полей.
   * @param item - конфигурация поля
   */
  autoSetDateFromControls(item: FpcInputsInterface): void {
    if (!item.autoSetValueFromControls || !item.minDateFromMaxOfControls?.length) {
      return;
    }

    const dateValue = this.getDateFromMaxOfControls(item);
    if (dateValue) {
      const control = this.form.get(item.formControlName);
      if (control) {
        control.setValue(this.getUnzonedDate(dateValue as Date));
      }
    }
  }
}
