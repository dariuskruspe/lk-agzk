import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Subject } from 'rxjs';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { IssueTemplateBuilderFieldOverlayComponent } from './issue-template-builder-field-overlay/issue-template-builder-field-overlay.component';
import { IssueTemplateBuilderFieldEvent } from '../shared/types';
import { toObservable } from '@angular/core/rxjs-interop';
import { findFieldDeepInTemplate } from '../shared/issue-template-utils';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { RecreateViewDirective } from '@shared/directives/recreate-view-key.directive';

@Component({
    selector: 'app-issue-template-builder-preview',
    imports: [
        FpcModule,
        SelectButtonModule,
        FormsModule,
        IssueTemplateBuilderFieldOverlayComponent,
        RecreateViewDirective,
    ],
    templateUrl: './issue-template-builder-preview.component.html',
    styleUrl: './issue-template-builder-preview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueTemplateBuilderPreviewComponent {
  templates = input.required<FpcInputsInterface[]>();

  // путь к полю которое надо выделить
  focusedField = input<string[] | null>(null);

  // состояние инспектора (включен/выключен)
  inspectorEnabled = input<boolean>(true);

  settingsValue = input<{ [key: string]: any }>();

  editField = output<IssueTemplateBuilderFieldEvent>();

  deleteField = output<IssueTemplateBuilderFieldEvent>();

  config = computed<FpcInterface>(() => {
    return {
      options: {
        changeStrategy: 'push',
        appearanceElements: 'outline',
        editMode: true,
        viewMode: 'edit',
      },
      template: this.templates(),
    };
  });

  uniqConfigKey = computed(() => {
    const config = this.config();
    return JSON.stringify(config || {});
  });

  currentFieldTree = signal<FieldTree | null>(null);

  currentOverlay = computed(() => {
    if (!this.currentFieldTree() || !this.inspectorEnabled()) {
      return null;
    }

    return {
      target: this.currentFieldTree()!.getElement(),
    };
  });

  currentFocusedField = computed(() => {
    const focusedField = this.focusedField();
    if (!focusedField || !this.inspectorEnabled()) {
      return [];
    }

    const field = findFieldDeepInTemplate(this.templates(), focusedField);
    if (!field) {
      return [];
    }

    let selector = `[data-custom-form-field="${field.formControlName}"]`;

    const el = document.querySelectorAll(selector);

    if (!el.length) {
      return [];
    }

    return Array.from(el).map((i) => ({
      target: i,
    }));
  });

  fpcConfig$ = toObservable(this.config);

  submitForm$ = new Subject();

  edit$: 'show' | 'edit' = 'edit';

  submit$: Subject<void> = new Subject<void>();

  clear$: Subject<void>;

  constructor() {
    effect(
      () => {
        const currentFocusedField = this.currentFocusedField();

        // если есть фокус на поле, то надо сбросить текущее поле
        if (currentFocusedField.length) {
          this.currentFieldTree.set(null);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngAfterViewInit() {
    // listen to all hovers over .custom-form-field
    document.addEventListener('mouseover', this.onMouseOver);
    document.addEventListener('mouseout', this.onMouseOut);
  }

  ngOnDestroy() {
    document.removeEventListener('mouseover', this.onMouseOver);
    document.removeEventListener('mouseout', this.onMouseOut);
  }

  private getFormControlByName(name: string) {
    return this.templates().find((t) => t.formControlName === name);
  }

  private onMouseOver = (e: MouseEvent) => {
    // Если инспектор выключен, то ничего не делаем
    if (!this.inspectorEnabled()) {
      return;
    }

    const tree = this.findElementFieldTree(e.target as HTMLElement);

    if (tree) {
      // todo: compare with previous tree
      this.currentFieldTree.set(tree);
    }
  };

  private onMouseOut = (e: MouseEvent) => {
    // Если инспектор выключен, то ничего не делаем
    if (!this.inspectorEnabled()) {
      return;
    }

    const tree = this.findElementFieldTree(e.target as HTMLElement);
    if (!tree) {
      return;
    }

    if (this.currentFieldTree()?.path === tree.path) {
      // this.currentFieldTree.set(null);
    }
  };

  private findElementFieldTree(element: HTMLElement) {
    const fieldTree = [];
    let isBuilderField = false;
    while (element) {
      if (element.getAttribute('data-custom-form-field')) {
        fieldTree.unshift({
          element,
          type: element.getAttribute('data-custom-form-type'),
          field: element.getAttribute('data-custom-form-field'),
        });
      }

      if (element.classList.contains('issue-template-builder-preview')) {
        isBuilderField = true;
      }

      element = element.parentElement;
    }

    if (fieldTree.length === 0 || !isBuilderField) {
      return null;
    }

    return new FieldTree(fieldTree);
  }

  onEditField(event: any) {
    this.editField.emit({
      path: this.currentFieldTree().getField(),
    });
    this.currentFieldTree.set(null);
  }

  onDeleteField(event: any) {
    this.deleteField.emit({
      path: this.currentFieldTree().getField(),
    });
    this.currentFieldTree.set(null);
  }
}

class FieldTree {
  readonly path: string;

  constructor(private treeFlat: FieldTreeFlatItem[]) {
    let path = '';
    for (const item of treeFlat) {
      if (item.arrayIndex !== undefined) {
        path += `[${item.arrayIndex}]`;
      } else {
        path += `.${item.field}`;
      }
    }
    this.path = path.slice(1);
  }

  getElement() {
    return this.treeFlat.at(-1).element;
  }

  // возвращает путь к полю вглубь
  getField() {
    return this.treeFlat.filter((i) => i.field).map((i) => i.field);
  }
}

type FieldTreeFlatItem = {
  element: HTMLElement;
  type?: string;
  field?: string;
  arrayIndex?: number;
};

type FieldListNode = FieldTreeFlatItem & {
  parent: FieldListNode;
};
