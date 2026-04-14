import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { IssueTypeTemplateFieldMappingInterface } from '@app/features/issues/models/issues-types.interface';
import { IssueTemplateRepository } from '../shared/issue-template-repository';
import { FIELD_TYPE_NAMES } from '@root/libs/form-page-constructor/projects/base/dictionaries/field-type-names.enum';
import { IssueTemplateFieldTypeBadgeComponent } from '../issue-template-field-type-badge/issue-template-field-type-badge.component';
import { CheckboxModule } from 'primeng/checkbox';

const NON_MAPPABLE_FIELDS = ['static'];
const DEBOUNCE_SAVE_TIME = 50;

interface FieldMappingForm {
  frontFieldControl: FormControl<string>;
  backendFieldControl: FormControl<string>;
  nameControl: FormControl<string>;
  uniquenessControl: FormControl<boolean>;
  fileForSignatureControl: FormControl<boolean>;
  onOtherEmployeesControl: FormControl<boolean>;
  onApplicantControl: FormControl<boolean>;
  onOtherEmployeesIsEmpFieldControl: FormControl<boolean>;
  onApplicantIsEmpFieldControl: FormControl<boolean>;
  id: string;
  parent: number; // Номер строки родительского поля (для вложенных)
  fieldPath?: string[]; // Путь к полю в шаблоне
  isNew?: boolean; // Флаг для новых сопоставлений
}
@Component({
    selector: 'app-issue-template-field-mapping',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IssueTemplateFieldTypeBadgeComponent,
        CheckboxModule,
    ],
    templateUrl: './issue-template-field-mapping.component.html',
    styleUrl: './issue-template-field-mapping.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class IssueTemplateFieldMappingComponent implements OnInit {
  repository = input.required<IssueTemplateRepository>();

  settings = computed(() => this.repository().value().settings);

  // Выбранное поле формы
  selectedFormField = '';

  // Отображение детей для arr-smart полей
  expandedChildren = new Set<string>();

  // Сигнал для форм сопоставлений
  private mappingForms = signal<FieldMappingForm[]>([]);

  // Флаг инициализации, чтобы избежать циклов сохранения
  private initializing = false;

  // Флаг для отслеживания внешних изменений vs собственные сохранения
  private isInternalUpdate = false;

  // Флаг для отслеживания необходимости сохранения
  private shouldSave = false;

  // Таймер для задержки сохранения
  private saveTimeout: any = null;

  // Предыдущее значение formFields для сравнения
  private previousFormFields: IssueTypeTemplateFieldMappingInterface[] = [];

  // Вычисляемый сигнал для отображения всех полей из шаблона
  fields = computed(() => {
    const template = this.repository().value().template || [];
    return template.filter(
      (field) => !NON_MAPPABLE_FIELDS.includes(field.type),
    );
  });

  // Вычисляемый сигнал для отображения всех сопоставлений
  mappings = computed(() => this.mappingForms());

  onApplicantEnabled = computed(() => this.settings().onApplicant);

  onOtherEmployeesEnabled = computed(() => this.settings().onOtherEmployees);

  constructor() {
    // Отслеживаем изменения в шаблоне
    effect(
      () => {
        // Получаем значение шаблона для активации эффекта
        const template = this.repository().value().template;

        // Инициализируем сопоставления при первом запуске
        if (!this.initializing && this.mappingForms().length === 0) {
          this.initializing = true;
          this.initMappingsFromRepository();
          this.initializing = false;
        }
      },
      {
        allowSignalWrites: true,
      },
    );

    // Отдельный effect для отслеживания изменений в formFields (для undo/redo)
    effect(
      () => {
        const formFields = this.repository().value().formFields || [];

        // Если это внутреннее обновление или первая инициализация, пропускаем
        if (this.isInternalUpdate || this.initializing) {
          // Сохраняем текущее значение для будущих сравнений
          this.previousFormFields = [...formFields];
          return;
        }

        // Проверяем, действительно ли произошли изменения, сравнивая с предыдущим значением
        const hasChanged = this.hasFormFieldsChanged(
          this.previousFormFields,
          formFields,
        );

        if (hasChanged) {
          // Обновляем формы на основе новых данных из репозитория
          this.initializing = true;
          this.updateMappingFormsFromFormFields(formFields);
          this.initializing = false;

          // Обновляем предыдущее значение
          this.previousFormFields = [...formFields];
        }
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnInit(): void {
    // Инициализация при первом запуске
    if (this.mappingForms().length === 0) {
      this.initMappingsFromRepository();
    }

    // Разворачиваем все массивы по умолчанию
    this.expandAllArrays();
  }

  // Сравнивает две коллекции formFields для определения изменений
  private hasFormFieldsChanged(
    oldFields: IssueTypeTemplateFieldMappingInterface[],
    newFields: IssueTypeTemplateFieldMappingInterface[],
  ): boolean {
    // Быстрая проверка размера
    if (oldFields.length !== newFields.length) {
      return true;
    }

    // Создаем карты для более эффективного поиска
    const oldFieldsMap = new Map<
      string,
      IssueTypeTemplateFieldMappingInterface
    >();
    oldFields.forEach((field) => {
      oldFieldsMap.set(field.id, field);
    });

    // Проверяем есть ли изменения в новых полях
    for (const newField of newFields) {
      const oldField = oldFieldsMap.get(newField.id);

      // Если поле не найдено или изменены какие-то свойства
      if (
        !oldField ||
        oldField.nameOnFront !== newField.nameOnFront ||
        oldField.nameOnIssue !== newField.nameOnIssue ||
        oldField.name !== newField.name ||
        oldField.uniquenessControl !== newField.uniquenessControl ||
        oldField.fileForSignature !== newField.fileForSignature ||
        oldField.parent !== newField.parent ||
        oldField.onOtherEmployees !== newField.onOtherEmployees ||
        oldField.onApplicant !== newField.onApplicant ||
        oldField.onOtherEmployeesIsEmpField !==
          newField.onOtherEmployeesIsEmpField ||
        oldField.onApplicantIsEmpField !== newField.onApplicantIsEmpField
      ) {
        return true;
      }
    }

    return false;
  }

  // Обновляет формы на основе данных из репозитория
  private updateMappingFormsFromFormFields(
    formFields: IssueTypeTemplateFieldMappingInterface[],
  ): void {
    // Создаем новые формы на основе полученных данных
    const forms = formFields.map((mapping) =>
      this.createMappingForm(mapping, false),
    );

    // Обновляем сигнал форм
    this.mappingForms.set(forms);

    // Если выбранное поле больше не существует, сбрасываем выбор
    if (this.selectedFormField) {
      const exists = forms.some(
        (form) => form.frontFieldControl.value === this.selectedFormField,
      );
      if (!exists) {
        this.selectedFormField = '';
      }
    }
  }

  // Метод для разворачивания всех массивов
  expandAllArrays(): void {
    this.fields().forEach((field) => {
      if (field.type === 'arr-smart' && field.arrSmartList?.length) {
        this.expandedChildren.add(field.formControlName);
      }
    });
  }

  // Выбор поля формы для редактирования сопоставления
  selectFormField(fieldName: string, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Предотвращаем всплытие события клика
    }

    // Проверяем, является ли поле дочерним элементом arr-smart
    const parentField = this.findParentField(fieldName);
    if (parentField) {
      // Если поле является дочерним и родительское поле не сопоставлено
      if (!this.isFieldMapped(parentField.formControlName)) {
        // Не разрешаем выбирать дочернее поле
        return;
      }
    }

    // Устанавливаем выбранное поле
    this.selectedFormField = fieldName;

    // Создаем сопоставление, если его еще нет
    if (!this.isFieldMapped(fieldName)) {
      this.createMappingForField(fieldName);
    }
  }

  // Находит родительское поле arr-smart для дочернего поля
  findParentField(childFieldName: string): FpcInputsInterface | null {
    // Проверяем все поля типа arr-smart
    for (const field of this.fields()) {
      if (field.type === 'arr-smart' && field.arrSmartList?.length) {
        // Ищем дочернее поле в arrSmartList
        const isChild = field.arrSmartList.some(
          (child) => child.formControlName === childFieldName,
        );

        if (isChild) {
          return field;
        }
      }
    }

    return null;
  }

  // Проверка, является ли поле дочерним для arr-smart и доступно ли оно для сопоставления
  isChildFieldAvailable(childFieldName: string): boolean {
    const parentField = this.findParentField(childFieldName);
    if (!parentField) {
      // Это не дочернее поле, значит доступно
      return true;
    }

    // Дочернее поле доступно только если родительское сопоставлено
    return this.isFieldMapped(parentField.formControlName);
  }

  // Создание сопоставления для поля
  createMappingForField(fieldName: string): void {
    // Проверяем, что сопоставление еще не существует
    if (this.isFieldMapped(fieldName)) {
      return;
    }

    // Создаем пустое сопоставление
    const newMapping: IssueTypeTemplateFieldMappingInterface = {
      name: '',
      nameOnFront: fieldName,
      nameOnIssue: '',
      uniquenessControl: false,
      parent: 0, // Будет установлено правильно при сохранении
      id: this.generateId(),
      indicator: '',
      fileForSignature: false,
      onOtherEmployees: false,
      onApplicant: false,
      onOtherEmployeesIsEmpField: false,
      onApplicantIsEmpField: false,
    };

    // Добавляем в массив форм
    const newForm = this.createMappingForm(newMapping, true);
    this.mappingForms.update((forms) => [...forms, newForm]);
  }

  // Удаление сопоставления для поля
  deleteMappingForField(fieldName: string): void {
    const mappingToDelete = this.mappingForms().find(
      (form) => form.frontFieldControl.value === fieldName,
    );

    if (mappingToDelete) {
      this.deleteMapping(mappingToDelete.id);
    }

    // Если удаляем выбранное поле, сбрасываем выбор
    if (this.selectedFormField === fieldName) {
      this.selectedFormField = '';
    }
  }

  // Получение контролов для выбранного поля
  getBackendFieldControl(): FormControl<string> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.backendFieldControl : new FormControl('');
  }

  getNameControl(): FormControl<string> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.nameControl : new FormControl('');
  }

  getUniquenessControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.uniquenessControl : new FormControl(false);
  }

  getFileForSignatureControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.fileForSignatureControl : new FormControl(false);
  }

  getOnOtherEmployeesControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.onOtherEmployeesControl : new FormControl(false);
  }

  getOnApplicantControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping ? mapping.onApplicantControl : new FormControl(false);
  }

  getOnOtherEmployeesIsEmpFieldControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping
      ? mapping.onOtherEmployeesIsEmpFieldControl
      : new FormControl(false);
  }

  getOnApplicantIsEmpFieldControl(): FormControl<boolean> {
    const mapping = this.getMappingFormForField(this.selectedFormField);
    return mapping
      ? mapping.onApplicantIsEmpFieldControl
      : new FormControl(false);
  }

  // Получение формы сопоставления для поля
  getMappingFormForField(fieldName: string): FieldMappingForm | null {
    return (
      this.mappingForms().find(
        (form) => form.frontFieldControl.value === fieldName,
      ) || null
    );
  }

  // Получение информации о выбранном поле
  getSelectedFieldLabel(): string {
    if (!this.selectedFormField) return '';

    // Ищем в корневых полях
    let field = this.fields().find(
      (f) => f.formControlName === this.selectedFormField,
    );

    // Если не нашли, ищем в дочерних
    if (!field) {
      for (const parentField of this.fields()) {
        if (
          parentField.type === 'arr-smart' &&
          parentField.arrSmartList?.length
        ) {
          const childField = parentField.arrSmartList.find(
            (child) => child.formControlName === this.selectedFormField,
          );

          if (childField) {
            field = childField;
            break;
          }
        }
      }
    }

    return field ? field.label || field.formControlName : '';
  }

  getSelectedFieldType(): string {
    if (!this.selectedFormField) return '';

    // Ищем в корневых полях
    let field = this.fields().find(
      (f) => f.formControlName === this.selectedFormField,
    );

    // Если не нашли, ищем в дочерних
    if (!field) {
      for (const parentField of this.fields()) {
        if (
          parentField.type === 'arr-smart' &&
          parentField.arrSmartList?.length
        ) {
          const childField = parentField.arrSmartList.find(
            (child) => child.formControlName === this.selectedFormField,
          );

          if (childField) {
            field = childField;
            break;
          }
        }
      }
    }

    return field ? field.type : '';
  }

  // Управление видимостью дочерних полей
  toggleChildrenVisibility(fieldName: string, event: Event): void {
    event.stopPropagation(); // Предотвращаем всплытие события клика

    if (this.expandedChildren.has(fieldName)) {
      this.expandedChildren.delete(fieldName);
    } else {
      this.expandedChildren.add(fieldName);
    }
  }

  isChildrenVisible(fieldName: string): boolean {
    return this.expandedChildren.has(fieldName);
  }

  // Получение имени поля на бэкенде для отображения
  getBackendFieldName(fieldName: string): string {
    const mapping = this.mappingForms().find(
      (form) => form.frontFieldControl.value === fieldName,
    );

    return mapping ? mapping.backendFieldControl.value : '';
  }

  // Проверка, сопоставлено ли поле
  isFieldMapped(fieldName: string): boolean {
    return this.mappingForms().some(
      (form) =>
        form.frontFieldControl.value === fieldName &&
        !!form.backendFieldControl.value,
    );
  }

  // Получение имени типа поля
  getFieldTypeName(type: string): string {
    return FIELD_TYPE_NAMES[type] || type;
  }

  // Получение информации о типе поля
  getFieldTypeDisplay(fieldName: string): string {
    // Ищем поле в корне
    let field = this.fields().find((f) => f.formControlName === fieldName);

    // Если не нашли в корне, ищем среди дочерних полей
    if (!field) {
      for (const parentField of this.fields()) {
        if (
          parentField.type === 'arr-smart' &&
          parentField.arrSmartList?.length
        ) {
          const childField = parentField.arrSmartList.find(
            (child) => child.formControlName === fieldName,
          );

          if (childField) {
            field = childField;
            break;
          }
        }
      }
    }

    if (!field) {
      return 'Тип не определен';
    }

    // Получаем русское название типа
    const typeName = FIELD_TYPE_NAMES[field.type] || field.type;

    // Собираем строку с расширенной информацией
    let infoString = `Тип: ${typeName}`;

    if (field.validations && field.validations.length) {
      infoString += ' • Обязательное';
    }

    return infoString;
  }

  // Получение только родительских полей (не arr-smart)
  getParentFields(): FpcInputsInterface[] {
    return this.fields().filter((field) => field.type !== 'arr-smart');
  }

  // Получение только arr-smart полей
  getArrSmartFields(): FpcInputsInterface[] {
    return this.fields().filter(
      (field) => field.type === 'arr-smart' && field.arrSmartList?.length,
    );
  }

  // Проверка, сопоставлено ли родительское поле
  isParentMapped(parentFieldName: string): boolean {
    // Родительское поле должно быть сопоставлено, прежде чем мы сможем сопоставить дочерние поля
    return this.mappingForms().some(
      (form) =>
        form.frontFieldControl.value === parentFieldName &&
        !!form.backendFieldControl.value,
    );
  }

  // Проверка на невалидную форму
  isInvalid(mapping: FieldMappingForm): boolean {
    // Для новых строк не показываем ошибку сразу
    if (mapping.isNew) {
      return false;
    }

    const frontInvalid =
      mapping.frontFieldControl.invalid && mapping.frontFieldControl.touched;
    const backendInvalid =
      mapping.backendFieldControl.invalid &&
      mapping.backendFieldControl.touched;
    return frontInvalid || backendInvalid;
  }

  // Инициализация сопоставлений из репозитория
  private initMappingsFromRepository(): void {
    const mappings = this.repository().value()?.formFields || [];

    // Сохраняем текущее значение для отслеживания изменений
    this.previousFormFields = [...mappings];

    // Создаем формы для каждого сопоставления
    const forms = mappings.map((mapping) =>
      this.createMappingForm(mapping, false),
    );
    this.mappingForms.set(forms);
  }

  // Создание формы сопоставления
  private createMappingForm(
    mapping?: IssueTypeTemplateFieldMappingInterface,
    isNew = true,
  ): FieldMappingForm {
    const frontFieldControl = new FormControl(mapping?.nameOnFront || '', {
      validators: [Validators.required],
      updateOn: 'blur',
    });
    const backendFieldControl = new FormControl(mapping?.nameOnIssue || '', {
      validators: [Validators.required],
      updateOn: 'blur',
    });
    const nameControl = new FormControl(mapping?.name || '', {
      validators: [Validators.required],
      updateOn: 'blur',
    });
    const uniquenessControl = new FormControl(
      mapping?.uniquenessControl || false,
    );
    const fileForSignatureControl = new FormControl(
      mapping?.fileForSignature || false,
    );
    const onOtherEmployeesControl = new FormControl(
      mapping?.onOtherEmployees || false,
    );
    const onApplicantControl = new FormControl(mapping?.onApplicant || false);
    const onOtherEmployeesIsEmpFieldControl = new FormControl(
      mapping?.onOtherEmployeesIsEmpField || false,
    );
    const onApplicantIsEmpFieldControl = new FormControl(
      mapping?.onApplicantIsEmpField || false,
    );

    // Отмечаем поля как touched только если это не новая форма
    if (!isNew) {
      frontFieldControl.markAsTouched();
      backendFieldControl.markAsTouched();
      nameControl.markAsTouched();
    }

    // Добавляем слушатели изменений для сохранения
    frontFieldControl.valueChanges.subscribe(() => {
      frontFieldControl.markAsTouched();
      this.markForSave();
    });

    backendFieldControl.valueChanges.subscribe(() => {
      backendFieldControl.markAsTouched();
      this.markForSave();
    });

    nameControl.valueChanges.subscribe(() => {
      nameControl.markAsTouched();
      this.markForSave();
    });

    uniquenessControl.valueChanges.subscribe(() => this.markForSave());
    fileForSignatureControl.valueChanges.subscribe(() => this.markForSave());

    // Слушатели для новых полей
    onOtherEmployeesControl.valueChanges.subscribe(() => {
      // Если отключаем возможность оформления на других сотрудников,
      // то отключаем и признак "является полем сотрудник"
      if (!onOtherEmployeesControl.value) {
        onOtherEmployeesIsEmpFieldControl.setValue(false);
      }
      this.markForSave();
    });

    onApplicantControl.valueChanges.subscribe(() => {
      // Если отключаем возможность оформления на заявителя,
      // то отключаем и признак "является полем сотрудник"
      if (!onApplicantControl.value) {
        onApplicantIsEmpFieldControl.setValue(false);
      }
      this.markForSave();
    });

    onOtherEmployeesIsEmpFieldControl.valueChanges.subscribe(() =>
      this.markForSave(),
    );
    onApplicantIsEmpFieldControl.valueChanges.subscribe(() =>
      this.markForSave(),
    );

    return {
      frontFieldControl,
      backendFieldControl,
      nameControl,
      uniquenessControl,
      fileForSignatureControl,
      onOtherEmployeesControl,
      onApplicantControl,
      onOtherEmployeesIsEmpFieldControl,
      onApplicantIsEmpFieldControl,
      id: mapping?.id || this.generateId(),
      parent: mapping?.parent || 0,
      isNew: isNew,
    };
  }

  // Генерация уникального ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Удаление сопоставления
  deleteMapping(id: string): void {
    // Проверяем, не используется ли удаляемое поле как родительское для других
    const mappingToDelete = this.mappingForms().find((form) => form.id === id);

    if (mappingToDelete) {
      const frontFieldName = mappingToDelete.frontFieldControl.value;
      const isArrSmart = this.fields().some(
        (field) =>
          field.type === 'arr-smart' &&
          field.formControlName === frontFieldName,
      );

      // Если это arr-smart, нужно удалить все дочерние сопоставления
      if (isArrSmart) {
        // Находим все дочерние поля
        const childFields =
          this.fields()
            .find((field) => field.formControlName === frontFieldName)
            ?.arrSmartList?.map((child) => child.formControlName) || [];

        // Удаляем сопоставления для дочерних полей
        this.mappingForms.update((forms) =>
          forms.filter(
            (form) =>
              form.id !== id &&
              !childFields.includes(form.frontFieldControl.value),
          ),
        );
      } else {
        // Просто удаляем текущее сопоставление
        this.mappingForms.update((forms) =>
          forms.filter((form) => form.id !== id),
        );
      }
    }

    this.markForSave();
  }

  // Отметить для сохранения с задержкой
  private markForSave(): void {
    if (this.initializing) return;

    // Сбрасываем предыдущий таймер, если он был
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    // Устанавливаем новый таймер для дебаунса
    this.saveTimeout = setTimeout(() => {
      this.saveToRepository();
    }, DEBOUNCE_SAVE_TIME);
  }

  // Сохранение данных в репозиторий
  private saveToRepository(): void {
    if (this.initializing) return;

    const template = this.repository().value();

    // Находим для каждого frontFieldControl его родительское поле (если есть)
    this.mappingForms().forEach((form) => {
      const frontFieldName = form.frontFieldControl.value;
      if (frontFieldName) {
        // Проверяем, находится ли поле в корне или внутри arr-smart
        let isChildField = false;
        let parentField: FpcInputsInterface | null = null;
        let parentIndex = -1;

        // Сначала проверяем, есть ли это поле в корне
        const rootField = template.template.findIndex(
          (f) => f.formControlName === frontFieldName,
        );
        if (rootField !== -1) {
          form.parent = 0; // Поле в корне
          form.fieldPath = [frontFieldName];
        } else {
          // Если не в корне, ищем в arr-smart полях
          for (let i = 0; i < template.template.length; i++) {
            const field = template.template[i];
            if (field.type === 'arr-smart' && field.arrSmartList?.length) {
              const childIndex = field.arrSmartList.findIndex(
                (child) => child.formControlName === frontFieldName,
              );
              if (childIndex !== -1) {
                parentField = field;
                parentIndex = i;
                isChildField = true;
                form.parent = parentIndex + 1; // +1 т.к. строки нумеруются с 1
                form.fieldPath = [field.formControlName, frontFieldName];
                break;
              }
            }
          }
        }
      }
    });

    // Преобразуем формы в интерфейс маппинга
    // Сохраняем только заполненные формы
    const formFields = this.mappingForms()
      .filter(
        (form) =>
          form.frontFieldControl.value && form.backendFieldControl.value,
      )
      .map((form) => {
        // Если форма валидна, сбрасываем флаг isNew
        if (
          form.isNew &&
          form.frontFieldControl.value &&
          form.backendFieldControl.value
        ) {
          form.isNew = false;
        }

        return {
          name: form.nameControl.value || form.backendFieldControl.value,
          nameOnFront: form.frontFieldControl.value,
          nameOnIssue: form.backendFieldControl.value,
          uniquenessControl: form.uniquenessControl.value,
          parent: form.parent,
          id: form.id,
          indicator: '',
          fileForSignature: form.fileForSignatureControl.value,
          onOtherEmployees: form.onOtherEmployeesControl.value,
          onApplicant: form.onApplicantControl.value,
          onOtherEmployeesIsEmpField:
            form.onOtherEmployeesIsEmpFieldControl.value,
          onApplicantIsEmpField: form.onApplicantIsEmpFieldControl.value,
        } as IssueTypeTemplateFieldMappingInterface;
      });

    // Устанавливаем флаг внутреннего обновления, чтобы избежать циклов
    this.isInternalUpdate = true;

    try {
      // Обновляем репозиторий с новыми сопоставлениями
      this.repository().updateFormFields(formFields);

      // Обновляем предыдущее значение для сравнения
      this.previousFormFields = [...formFields];
    } finally {
      // Всегда сбрасываем флаг внутреннего обновления
      setTimeout(() => {
        this.isInternalUpdate = false;
      }, 0);
    }
  }

  // Проверка доступности полей
  isOnOtherEmployeesIsEmpFieldEnabled(): boolean {
    const onOtherEmployeesControl = this.getOnOtherEmployeesControl();
    return onOtherEmployeesControl.value;
  }

  isOnApplicantIsEmpFieldEnabled(): boolean {
    const onApplicantControl = this.getOnApplicantControl();
    return onApplicantControl.value;
  }
}
