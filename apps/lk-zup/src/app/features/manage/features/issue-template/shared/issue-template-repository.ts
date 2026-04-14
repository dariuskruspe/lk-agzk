import { computed, signal } from '@angular/core';
import { IssueTemplateSettingsInterface, IssueTemplateValue } from './types';
import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { IssueTypeTemplateFieldMappingInterface } from '@app/features/issues/models/issues-types.interface';
import { random } from 'lodash';

const MAX_HISTORY_SIZE = 20;

export class IssueTemplateRepository {
  readonly value = signal<IssueTemplateValue>({
    template: [],
    formFields: [],
    settings: {
      FullName: '',
      ShortName: '',
      description: '',
      showInSelectionList: false,
      quickAccess: false,
      onApplicant: true,
      onOtherEmployees: false,
      iconName: '',
      createByAssistant: false,
      aiPrompt: '',
    },
  });

  private undoStack = signal<IssueTemplateValue[]>([]);
  private redoStack = signal<IssueTemplateValue[]>([]);

  canUndo = computed(() => this.undoStack().length > 0);
  canRedo = computed(() => this.redoStack().length > 0);

  constructor() {}

  deleteTemplateField(path: string[]) {
    this.transaction(() => this.deleteFieldDeepInTemplate(this.value(), path));
  }

  addTemplateField(
    path: string[],
    index: number,
    newField: FpcInputsInterface,
  ) {
    this.transaction(() =>
      this.addFieldDeepInTemplate(this.value(), path, index, newField),
    );
  }

  updateTemplateField(path: string[], newField: FpcInputsInterface) {
    this.transaction(() =>
      this.replaceFieldDeepInTemplate(this.value(), path, newField),
    );
  }

  getTemplateField(path: string[]) {
    return this.findFieldDeepInTemplate(this.value().template, path);
  }

  updateFormFields(formFields: IssueTypeTemplateFieldMappingInterface[]) {
    this.transaction(() => ({ ...this.value(), formFields }));
  }

  set(template: IssueTemplateValue, resetHistory = true) {
    for (const item of template.template) {
      // если нет formControlName, то генерируем его т.к. он нужен для того чтобы мы могли ссылаться на него при редактировании
      if (!item.formControlName) {
        item.formControlName = `${item.type}-${random(1000000, 9999999)}`;
      }

      if (item.arrSmartList?.length) {
        for (const innerItem of item.arrSmartList) {
          if (!innerItem.formControlName) {
            innerItem.formControlName = `${innerItem.type}-${random(1000000, 9999999)}`;
          }
        }
      }
    }
    this.transaction(() => template);
    if (resetHistory) {
      this.undoStack.set([]);
      this.redoStack.set([]);
    }
  }

  private transaction(fn: () => IssueTemplateValue) {
    // Сохраняем текущее состояние в стек отмены
    const currentUndoStack = this.undoStack();
    if (currentUndoStack.length >= MAX_HISTORY_SIZE) {
      this.undoStack.set([
        ...currentUndoStack.slice(1),
        structuredClone(this.value()),
      ]);
    } else {
      this.undoStack.set([...currentUndoStack, structuredClone(this.value())]);
    }

    // Очищаем стек повтора при новой транзакции
    this.redoStack.set([]);

    const value = fn();
    this.value.set({
      ...value,
      template: [...value.template],
    });
  }

  undo() {
    const currentUndoStack = this.undoStack();
    if (currentUndoStack.length === 0) return;

    // Сохраняем текущее состояние в стек повтора
    const currentRedoStack = this.redoStack();
    this.redoStack.set([...currentRedoStack, structuredClone(this.value())]);

    // Восстанавливаем предыдущее состояние
    const previousState = currentUndoStack[currentUndoStack.length - 1];
    this.undoStack.set(currentUndoStack.slice(0, -1));
    this.value.set(structuredClone(previousState));
  }

  redo() {
    const currentRedoStack = this.redoStack();
    if (currentRedoStack.length === 0) return;

    // Сохраняем текущее состояние в стек отмены
    const currentUndoStack = this.undoStack();
    this.undoStack.set([...currentUndoStack, structuredClone(this.value())]);

    // Восстанавливаем следующее состояние
    const nextState = currentRedoStack[currentRedoStack.length - 1];
    this.redoStack.set(currentRedoStack.slice(0, -1));
    this.value.set(structuredClone(nextState));
  }

  private replaceFieldDeepInTemplate(
    template: IssueTemplateValue,
    path: string[],
    newField: FpcInputsInterface,
  ) {
    const field = this.findFieldDeepInTemplate(template.template, path);

    // чистим все поля в объекте и перезаписываем новыми
    for (const key of Object.keys(field)) {
      if (Object.hasOwn(field, key)) {
        delete field[key];
      }
    }
    Object.assign(field, newField);
    return template;
  }

  private deleteFieldDeepInTemplate(
    template: IssueTemplateValue,
    path: string[],
  ) {
    if (path.length === 1) {
      template.template = template.template.filter(
        (i) => i.formControlName !== path[0],
      );
      return template;
    }

    const parentField = this.findFieldDeepInTemplate(
      template.template,
      path.slice(0, -1),
    );
    parentField.arrSmartList = parentField.arrSmartList.filter(
      (i) => i.formControlName !== path[path.length - 1],
    );

    return template;
  }

  private findFieldDeepInTemplate(
    templates: FpcInputsInterface[],
    path: string[],
  ): FpcInputsInterface | null {
    let field = templates.find((t) => t.formControlName === path[0]);
    if (!field) {
      return null;
    }

    if (path.length === 1) {
      return field;
    }

    path = path.slice(1);

    while (path.length > 0 && field.arrSmartList) {
      field = field.arrSmartList.find((i) => i.formControlName === path[0]);
      path = path.slice(1);
    }

    return field;
  }

  private addFieldDeepInTemplate(
    template: IssueTemplateValue,
    path: string[],
    index: number,
    newField: FpcInputsInterface,
  ) {
    if (path.length === 0) {
      template.template.splice(index, 0, newField);
      return template;
    }

    const parentField = this.findFieldDeepInTemplate(template.template, path);
    parentField.arrSmartList.splice(index, 0, newField);
    return template;
  }

  moveTemplateField(path: string[], newIndex: number) {
    this.transaction(() =>
      this.moveFieldDeepInTemplate(this.value(), path, newIndex),
    );
  }

  private moveFieldDeepInTemplate(
    template: IssueTemplateValue,
    path: string[],
    newIndex: number,
  ) {
    if (path.length === 0) {
      return template;
    }

    if (path.length === 1) {
      // Находим индекс перемещаемого элемента
      const oldIndex = template.template.findIndex(
        (i) => i.formControlName === path[0],
      );

      if (oldIndex === -1) {
        return template;
      }

      // Извлекаем элемент из массива
      const [movedField] = template.template.splice(oldIndex, 1);

      // Вставляем элемент в новую позицию
      template.template.splice(newIndex, 0, movedField);

      return template;
    }

    // Для вложенных элементов в arr-smart
    const parentField = this.findFieldDeepInTemplate(
      template.template,
      path.slice(0, -1),
    );

    if (!parentField || !parentField.arrSmartList) {
      return template;
    }

    // Находим индекс перемещаемого элемента
    const oldIndex = parentField.arrSmartList.findIndex(
      (i) => i.formControlName === path[path.length - 1],
    );

    if (oldIndex === -1) {
      return template;
    }

    // Извлекаем элемент из массива
    const [movedField] = parentField.arrSmartList.splice(oldIndex, 1);

    // Вставляем элемент в новую позицию
    parentField.arrSmartList.splice(newIndex, 0, movedField);

    return template;
  }

  // Метод для обновления шаблона из JSON
  updateTemplateFromJson(jsonTemplate: FpcInputsInterface[]) {
    this.transaction(() => {
      return { ...this.value(), template: jsonTemplate };
    });
  }

  patchSettings(settings: Partial<IssueTemplateSettingsInterface>) {
    this.transaction(() => ({
      ...this.value(),
      settings: {
        ...this.value().settings,
        ...settings,
      },
    }));
  }
}
