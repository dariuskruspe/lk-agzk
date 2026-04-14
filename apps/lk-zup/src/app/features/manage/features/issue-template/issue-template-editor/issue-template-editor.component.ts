import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { FormFieldItem, IssueTemplateBuilderFieldEvent } from '../shared/types';
import { IssueTemplateRepository } from '../shared/issue-template-repository';
import { IssueTemplateBuilderPreviewComponent } from '../issue-template-builder-preview/issue-template-builder-preview.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { IssueTemplateFieldListComponent } from './issue-template-field-list/issue-template-field-list.component';
import { IssueTemplateJsonEditorDialogComponent } from '../issue-template-json-editor-dialog/issue-template-json-editor-dialog.component';
import { IssueTemplateBuilderFieldSettingsComponent } from '../issue-template-builder-field-settings/issue-template-builder-field-settings.component';
import { IconInspectComponent } from '../../../../../shared/icons/icon-inspect.component';

// Тип для режима предпросмотра
type PreviewMode = 'desktop' | 'mobile';

@Component({
    selector: 'app-issue-template-editor',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        DragDropModule,
        TooltipModule,
        OverlayPanelModule,
        IssueTemplateBuilderPreviewComponent,
        IssueTemplateFieldListComponent,
        IssueTemplateBuilderFieldSettingsComponent,
        IconInspectComponent,
    ],
    templateUrl: './issue-template-editor.component.html',
    styleUrl: './issue-template-editor.component.scss'
})
export class IssueTemplateEditorComponent implements OnInit {
  repository = input.required<IssueTemplateRepository>();
  templates = computed(() => this.repository().value().template);

  op = viewChild<OverlayPanel>('op');

  // Режим предпросмотра (desktop/mobile)
  previewMode = signal<PreviewMode>('desktop');

  // Состояние инспектора (включен/выключен)
  inspectorEnabled = signal<boolean>(true);

  // Инициализируем доступные поля прямо в компоненте
  availableFields = signal<
    { title: string; icon: string; fields: FormFieldItem[] }[]
  >([]);

  focusedField = signal<string[] | null>(null);

  // Для позиционирования popover
  currentInsertIndex: number | null = null;
  currentInsertPath: string[] | null = null;

  // Состояние для настроек поля
  fieldSettingsVisible = signal<boolean>(false);
  currentFieldValue = signal<Partial<FpcInputsInterface>>({});
  currentFieldPath = signal<string[]>([]);

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.availableFields.set([
      {
        title: 'Основное',
        icon: 'pi pi-pencil',
        fields: [
          { name: 'Текстовое поле', type: 'text' },
          { name: 'Многострочное поле ввода', type: 'textarea' },
          { name: 'Чекбокс', type: 'checkbox' },

          {
            name: 'Группа произвольных полей',
            type: 'arr-smart',
            arrSmartList: [],
          },
          { name: 'Поле ввода пароля', type: 'password' },

          { name: 'Загрузка файла', type: 'file' },
          { name: 'Множественная загрузка файлов', type: 'file-multi' },
          { name: 'Радио-кнопки', type: 'radio' },

          { name: 'Вычисляемый статичный текст', type: 'computed-static' },
          { name: 'Статичный текст', type: 'static' },
        ],
      },
      {
        title: 'Дата и время',
        icon: 'pi pi-list',
        fields: [
          { name: 'Выбор даты', type: 'datepicker' },
          {
            name: 'Выбор стартовой даты для диапазона дат',
            type: 'datepicker-range-start',
          },
          {
            name: 'Выбор конечной даты для диапазона дат',
            type: 'datepicker-range-end',
          },
          { name: 'Выбор времени', type: 'timepicker' },
          { name: 'Выбор месяца', type: 'datepicker-month' },
          { name: 'Выбор года', type: 'datepicker-year' },
        ],
      },
      {
        title: 'Списки',
        icon: 'pi pi-calendar',
        fields: [
          {
            name: 'Выпадающий список для выбора сотрудника',
            type: 'select-employee',
          },
          { name: 'Выпадающий список', type: 'select' },
          {
            name: 'Выпадающий список с множественным выбором',
            type: 'select-multi',
          },
          {
            name: 'Выпадающий список с фильтрацией и множественным выбором',
            type: 'select-filter',
          },
        ],
      },
    ]);
  }

  // Метод для установки режима предпросмотра
  setPreviewMode(mode: PreviewMode): void {
    this.previewMode.set(mode);
  }

  // Метод для переключения состояния инспектора
  toggleInspector(): void {
    this.inspectorEnabled.update((value) => !value);
  }

  removeItem(path: string[]) {
    this.deleteSelectedItem({ path });
  }

  editItem(path: string[]) {
    this.editSelectedItem({ path });
  }

  // Функция для открытия popover с доступными полями
  showAddFieldPopover(event: {
    event: Event;
    path: string[];
    index: number;
    position?: number;
  }) {
    this.currentInsertIndex = event.index + 1; // вставить после текущего поля
    this.currentInsertPath = event.path;

    this.op()!.toggle(event.event);
  }

  // Функция для добавления поля из popover
  addFieldAtPosition(op: OverlayPanel, field: FormFieldItem) {
    console.log('field', field);
    this.currentFieldValue.set({
      type: field.type,
    });
    this.currentFieldPath.set([]);
    this.fieldSettingsVisible.set(true);

    op.hide();
  }

  editSelectedItem(event: IssueTemplateBuilderFieldEvent) {
    const field = this.repository().getTemplateField(event.path);

    this.currentFieldValue.set(field);
    this.currentFieldPath.set(event.path);
    this.fieldSettingsVisible.set(true);
  }

  deleteSelectedItem(event: IssueTemplateBuilderFieldEvent) {
    this.repository().deleteTemplateField(event.path);
  }

  getFieldLabel(field: FpcInputsInterface) {
    if (field.label) {
      return field.label;
    }

    if (field.type === 'arr-smart') {
      return field.arrSmartList
        .map((item) => this.getFieldLabel(item))
        .join(', ');
    }

    if (field.type === 'static') {
      return field.value;
    }

    return field.formControlName;
  }

  onFocusField(path: string[]) {
    this.focusedField.set(path);
  }

  onUnfocusField(path: string[]) {
    const currentPath = this.focusedField();
    if (currentPath && JSON.stringify(currentPath) === JSON.stringify(path)) {
      this.focusedField.set(null);
    }
  }

  // Добавим метод для обработки перемещения полей
  moveField(event: { path: string[]; newIndex: number }) {
    this.repository().moveTemplateField(event.path, event.newIndex);
  }

  // Методы для работы с настройками полей
  onFieldSettingsClose() {
    this.fieldSettingsVisible.set(false);
    this.currentFieldValue.set({});
    this.currentFieldPath.set([]);
  }

  onFieldSettingsSave(value: FpcInputsInterface) {
    const path = this.currentFieldPath();
    const type = value.type;

    if (path.length > 0) {
      // Редактирование существующего поля
      this.repository().updateTemplateField(path, { ...value, type });
    } else {
      // Добавление нового поля
      this.repository().addTemplateField(
        this.currentInsertPath,
        this.currentInsertIndex,
        { ...value, type },
      );
    }

    this.onFieldSettingsClose();
  }

  // Метод для открытия диалога редактирования JSON
  openJsonEditor(): void {
    // Получаем текущий JSON шаблона
    const jsonText = JSON.stringify(this.templates(), null, 2);

    // Открываем диалог с текстовым редактором для JSON
    const dialogRef = this.dialogService.open(
      IssueTemplateJsonEditorDialogComponent,
      {
        width: '80%',
        height: '80%',
        header: 'Редактирование JSON шаблона',
        closable: true,
        data: { jsonText },
      },
    );

    // Обрабатываем результат после закрытия диалога
    dialogRef.onClose.subscribe((result) => {
      if (result && result.templateJson) {
        try {
          const parsedJson = JSON.parse(result.templateJson);
          // Обновляем шаблон через репозиторий
          this.repository().updateTemplateFromJson(parsedJson);
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка в JSON',
            detail: 'Невозможно обновить шаблон: некорректный JSON',
          });
        }
      }
    });
  }
}
