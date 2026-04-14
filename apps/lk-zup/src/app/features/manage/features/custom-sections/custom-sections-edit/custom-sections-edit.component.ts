import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  model,
  signal,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { finalize } from 'rxjs';
import { CustomSectionsApiService } from '../shared/custom-sections-api.service';
import { CustomSection, CustomSectionContent } from '../shared/types';
import { CustomSectionsTemplateViewComponent } from '../../../../../shared/features/custom-sections/custom-sections-template-view/custom-sections-template-view.component';
import { CustomSectionsTemplateEditorComponent } from '../../../../../shared/features/custom-sections/custom-sections-template-editor/custom-sections-template-editor.component';
import { IconPickerComponent } from '../../../../../shared/components/icon-picker/icon-picker.component';

interface MenuItem {
  label: string;
  icon?: string; // Если иконки не нужны для табов, это свойство можно сделать опциональным или убрать
}

@Component({
    selector: 'app-custom-sections-edit',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        InputSwitchModule,
        CustomSectionsTemplateViewComponent,
        CustomSectionsTemplateEditorComponent,
        IconPickerComponent,
    ],
    templateUrl: './custom-sections-edit.component.html',
    styleUrl: './custom-sections-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSectionsEditComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly customSectionsService = inject(CustomSectionsApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  sectionId = signal<string | null>(null);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  section = signal<CustomSection | null>(null);

  form = new FormGroup({
    title: new FormControl(''),
    icon: new FormControl(''),
    template: new FormControl(''),
  });

  previewMode = new FormControl(false);

  activeTabIndex = signal(0);
  menuItems: MenuItem[] = [
    { label: 'Шаблон' },
    { label: 'Отображение в меню' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorInstance: any;

  constructor() {
    this.sectionId.set(this.route.snapshot.paramMap.get('id'));

    if (this.sectionId()) {
      this.loadSectionContent();
    }
  }

  ngOnInit(): void {
    this.loadSectionData();
  }

  loadSectionData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sectionId.set(id);
      this.loadSectionContent();
    } else {
      this.loading.set(false);
    }
  }

  loadSectionContent() {
    if (!this.sectionId()) return;

    this.loading.set(true);
    this.customSectionsService
      .getSectionContent(this.sectionId()!)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: CustomSectionContent) => {
          let template: any;

          try {
            // Пробуем распарсить JSON, если контент в формате EditorJS
            template = JSON.parse(data.template);
            if (template?.version === '2') {
              template = template.value;
            } else {
              template = '';
            }
          } catch (e) {
            // Если не получилось распарсить JSON, считаем что контент в формате HTML
            // и создаем блок параграфа с этим содержимым
            template = '';
          }

          this.form.patchValue({
            title: data.title,
            icon: data.iconName,
            template,
          });
        },
        error: (err) => {
          console.error('Ошибка при загрузке содержимого раздела', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось загрузить содержимое раздела',
          });
        },
      });
  }

  saveSection() {
    this.saving.set(true);

    if (!this.sectionId()) {
      // Для создания нового раздела потребуется дополнительный API
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Создание новых разделов в данный момент недоступно',
      });
      this.saving.set(false);
      return;
    }

    // Сохраняем содержимое существующего раздела
    this.customSectionsService
      .saveSectionContent({
        sectionID: this.sectionId()!,
        template: {
          version: '2',
          value: this.form.get('template')?.value,
        },
        title: this.form.get('title')?.value,
        iconName: this.form.get('icon')?.value,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Успех',
              detail: 'Раздел успешно сохранен',
            });
            this.router.navigate(['/manage/custom-sections']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: response.errorMsg || 'Не удалось сохранить раздел',
            });
          }
        },
        error: (err) => {
          console.error('Ошибка при сохранении раздела', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось сохранить раздел',
          });
        },
      });
  }

  cancelEdit() {
    this.router.navigate(['/manage/custom-sections']);
  }

  onEditorInit(editorInstance: unknown) {
    console.log('on init', editorInstance);
  }

  onTabChange(index: number): void {
    this.activeTabIndex.set(index);
  }
}
