import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  signal,
  computed,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';

import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import {
  FormFieldItem,
  IssueTemplateBuilderFieldEvent,
} from '../../shared/types';
import { IssueTemplateFieldTypeBadgeComponent } from '../../issue-template-field-type-badge/issue-template-field-type-badge.component';

@Component({
    selector: 'app-issue-template-field-list',
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        OverlayPanelModule,
        DragDropModule,
        IssueTemplateFieldTypeBadgeComponent,
    ],
    templateUrl: './issue-template-field-list.component.html',
    styleUrl: './issue-template-field-list.component.scss'
})
export class IssueTemplateFieldListComponent {
  templates = input.required<FpcInputsInterface[]>();
  focusedField = input.required<string[] | null>();

  addField = output<{
    event: Event;
    path: string[];
    index: number;
  }>();
  removeField = output<string[]>();
  editField = output<string[]>();
  focusField = output<string[]>();
  unfocusField = output<string[]>();
  moveField = output<{
    path: string[];
    newIndex: number;
  }>();

  // Для позиционирования popover
  currentInsertIndex: number | null = null;
  currentInsertPath: string[] | null = null;

  // Для drag & drop
  draggedField: FpcInputsInterface | null = null;
  draggedPath: string[] = [];
  draggedIndex: number = -1;
  dragTargetIndex: number = -1;
  draggedLevel: string[] = [];

  // Для отслеживания поля, над которым находится курсор
  currentHoverTarget: any = null;
  currentHoverPath: string[] = [];
  currentHoverIndex: number = -1;

  constructor(private elementRef: ElementRef) {}

  // Функция для получения метки поля
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

  // Функция для открытия popover с доступными полями
  showAddFieldPopover(event: Event, path: string[], index: number) {
    this.currentInsertIndex = index + 1; // вставить после текущего поля
    this.currentInsertPath = path;
    this.addField.emit({
      event,
      path,
      index,
    });
  }

  // Обработчики событий полей
  onRemoveItem(path: string[]) {
    this.removeField.emit(path);
  }

  onEditItem(path: string[]) {
    this.editField.emit(path);
  }

  onFocusField(path: string[]) {
    this.focusField.emit(path);
  }

  onUnfocusField(path: string[]) {
    this.unfocusField.emit(path);
  }

  // Drag & Drop handlers
  onDragStart(
    event: DragEvent,
    field: FpcInputsInterface,
    path: string[],
    index: number,
  ) {
    this.draggedField = field;
    this.draggedPath = [...path];
    this.draggedIndex = index;
    this.draggedLevel = [...path];

    // Добавляем класс к body для отображения состояния перетаскивания
    document.body.classList.add('dragging-field');
  }

  onDragEnd() {
    this.draggedField = null;
    this.draggedPath = [];
    this.draggedIndex = -1;
    this.dragTargetIndex = -1;
    this.draggedLevel = [];

    // Удаляем класс с body
    document.body.classList.remove('dragging-field');

    // Удаляем классы сдвига со всех элементов
    this.clearAllShiftClasses();
  }

  onDragEnter(
    event: DragEvent,
    field: any,
    path: string[],
    targetIndex: number,
  ) {
    console.log('onDragEnter', this.draggedField, event, targetIndex, path);
    // Проверяем, что перетаскивание происходит на том же уровне вложенности
    if (
      JSON.stringify(this.draggedPath) === JSON.stringify(path) &&
      this.draggedField
    ) {
      this.dragTargetIndex = targetIndex;
      this.draggedLevel = [...path];
      this.currentHoverTarget = field;
      this.currentHoverPath = [...path];
      this.currentHoverIndex = targetIndex;
      console.log('DragEnter:', path, targetIndex);
    }
  }

  onDrop(event: DragEvent, targetIndex: number, path: string[]) {
    console.log('onDrop', this.draggedField, event, targetIndex, path);
    // Проверяем, что перетаскивание происходит на том же уровне вложенности
    if (
      JSON.stringify(this.draggedPath) === JSON.stringify(path) &&
      this.draggedField
    ) {
      // Определяем индексы с учетом того, перетащили ли мы элемент вниз или вверх
      let sourceIndex = this.draggedIndex;
      let destIndex = targetIndex;

      // Проверяем, что целевой индекс отличается от исходного
      if (destIndex !== sourceIndex) {
        this.moveField.emit({
          path:
            path.length === 0
              ? [this.draggedField.formControlName]
              : [...path, this.draggedField.formControlName],
          newIndex: destIndex,
        });
      }
    }

    // Очищаем состояние перетаскивания
    this.draggedField = null;
    this.draggedPath = [];
    this.draggedIndex = -1;
    this.dragTargetIndex = -1;
    this.draggedLevel = [];
    this.currentHoverTarget = null;
    this.currentHoverPath = [];
    this.currentHoverIndex = -1;
  }

  isDropAllowed(path: string[]): boolean {
    // Проверяем, что путь совпадает с путем перетаскиваемого элемента
    return JSON.stringify(this.draggedPath) === JSON.stringify(path);
  }

  // Метод для применения классов сдвига к элементам
  private applyShiftClasses(path: string[], targetIndex: number) {
    // Пока упростим этот метод из-за проблем с типизацией
    // Будем использовать только эффект плавного появления drop placeholder'а
  }

  // Метод для удаления классов сдвига со всех элементов
  private clearAllShiftClasses() {
    // Пока не будем использовать этот метод из-за проблем с типизацией
  }

  // Обработчик наведения на поле во время перетаскивания
  onDragOver(event: DragEvent, field: any, path: string[], index: number) {
    if (
      this.draggedField &&
      this.draggedField !== field &&
      this.draggedPath.join(',') === path.join(',')
    ) {
      event.preventDefault(); // Важно для работы в некоторых браузерах
      this.currentHoverTarget = field;
      this.currentHoverPath = [...path];
      this.currentHoverIndex = index;
    }
  }

  onDragLeave(event: DragEvent) {
    // Проверяем, что событие действительно покидает элемент, а не переходит на его дочерний элемент
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (
      !relatedTarget ||
      !this.elementRef.nativeElement.contains(relatedTarget)
    ) {
      this.currentHoverTarget = null;
      this.currentHoverPath = [];
      this.currentHoverIndex = -1;
    }
  }

  isPlaceholderAbove(field: any, path: string[]): boolean {
    return (
      this.isPlaceholderActive(field, path) &&
      this.currentHoverIndex < this.draggedIndex
    );
  }

  isPlaceholderBelow(field: any, path: string[]): boolean {
    return (
      this.isPlaceholderActive(field, path) &&
      this.currentHoverIndex > this.draggedIndex
    );
  }

  // Проверяет, активен ли плейсхолдер для конкретного поля
  isPlaceholderActive(field: any, path: string[]): boolean {
    return (
      this.draggedField !== null &&
      this.draggedField !== field &&
      this.currentHoverTarget === field &&
      this.draggedPath.join(',') === path.join(',') &&
      this.currentHoverPath.join(',') === path.join(',')
    );
  }
}
