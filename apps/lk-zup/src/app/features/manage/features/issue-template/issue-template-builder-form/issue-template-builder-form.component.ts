import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { isEqual } from 'lodash';
import { cloneDeep } from 'lodash';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { MenuItem } from 'primeng/api';
import { PrimeFormUtilsModule } from '@root/libs/prime-form-utils/prime-form-utils.module';
import { IssueTemplateValue } from '../shared/types';
import { IssueTemplateRepository } from '../shared/issue-template-repository';
import { IssueTemplateEditorComponent } from '../issue-template-editor/issue-template-editor.component';
import { IssueTemplateFieldMappingComponent } from '../issue-template-field-mapping/issue-template-field-mapping.component';
import { IssueTemplateSettingsComponent } from '../issue-template-settings/issue-template-settings.component';
import { IssueTemplateBuilderChatComponent } from '../issue-template-builder-chat/issue-template-builder-chat.component';
import { EmployeesStaticDataManagerFacade } from '@app/features/employees/facades/employees-static-data-manager.facade';
import { UserStateService } from '@app/shared/states/user-state.service';
import { AppService } from '@app/shared/services/app.service';

@Component({
  selector: 'app-issue-template-builder-form',
  imports: [
    CommonModule,
    PrimeFormUtilsModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    AccordionModule,
    DragDropModule,
    TooltipModule,
    OverlayPanelModule,
    TabMenuModule,
    TabViewModule,
    IssueTemplateEditorComponent,
    IssueTemplateFieldMappingComponent,
    IssueTemplateSettingsComponent,
    IssueTemplateBuilderChatComponent,
  ],
  templateUrl: './issue-template-builder-form.component.html',
  styleUrl: './issue-template-builder-form.component.scss',
})
export class IssueTemplateBuilderFormComponent implements OnInit {
  private userState = inject(UserStateService);
  private messageService = inject(MessageService);
  private staticDataManager = inject(EmployeesStaticDataManagerFacade);
  private app = inject(AppService);

  value = input.required<IssueTemplateValue>();
  saving = input<boolean>(false);

  save = output<IssueTemplateValue>();
  cancel = output<void>();

  repository = new IssueTemplateRepository();
  hasChanged = computed(() => {
    return !isEqual(
      JSON.stringify(this.value()),
      JSON.stringify(this.repository.value()),
    );
  });

  // Меню навигации
  activeTabIndex = signal<number>(1);
  menuItems: MenuItem[] = [
    { label: 'Основное', icon: 'pi pi-cog' },
    { label: 'Форма', icon: 'pi pi-file-edit' },
    { label: 'Сопоставление полей', icon: 'pi pi-link' },
  ];

  isAiAvailable = computed(() => {
    return this.app.settingsSignal().assistant?.aiEnabled ?? false;
  });

  // Управление чатом
  showAiChat = signal<boolean>(true);

  constructor() {
    effect(
      () => {
        const value = this.value();
        setTimeout(() => {
          this.repository.set(cloneDeep(value));
        });
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.staticDataManager.getStaticData(this.userState.activeEmployeeId(), []);
  }

  getResult() {
    const result = this.repository.value().template;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Шаблон скопирован в буфер обмена',
      });
    });
  }

  // Метод для обработки сохранения формы
  saveForm() {
    this.save.emit(this.repository.value());
  }

  onCancel() {
    this.cancel.emit();
  }

  // Метод для переключения вкладок
  onTabChange(index: number) {
    this.activeTabIndex.set(index);
  }

  // Метод для переключения чата
  toggleAiChat() {
    this.showAiChat.update((show) => !show);
  }
}
