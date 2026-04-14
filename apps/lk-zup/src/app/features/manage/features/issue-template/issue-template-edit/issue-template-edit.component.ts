import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { signalProcess } from '@app/shared/services/signal-helpers/signal-process';
import { IssueTemplateApiService } from '../shared/issue-template-api.service';
import { IssueTemplateBuilderFormComponent } from '../issue-template-builder-form/issue-template-builder-form.component';
import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';
import { IssueTemplateValue } from '../shared/types';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-issue-template-edit',
    imports: [IssueTemplateBuilderFormComponent, Button, RouterLink],
    templateUrl: './issue-template-edit.component.html',
    styleUrl: './issue-template-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminIssueTemplateEditComponent {
  private issueTemplateApiService = inject(IssueTemplateApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  issueTemplateId = input.required<string>();

  resource = signalProcess((id: string) =>
    this.issueTemplateApiService.getIssueTemplateById(id),
  );

  saving = signal<boolean>(false);

  template = signal<IssueTemplateValue | null>(null);

  constructor() {
    effect(() => {
      const id = this.issueTemplateId();
      setTimeout(() => {
        this.resource.exec(id);
      });
    });

    effect(
      () => {
        const data = this.resource.data();
        if (data) {
          this.template.set({
            template: data.originTemplate,
            formFields: data.formFields ?? [],
            settings: {
              onApplicant: data.onApplicant,
              onOtherEmployees: data.onOtherEmployees,
              iconName: data.iconName ?? '',
              FullName: data.FullName ?? '',
              ShortName: data.ShortName ?? '',
              description: data.description ?? '',
              showInSelectionList: data.showInSelectionList ?? false,
              quickAccess: data.quickAccess ?? false,
              createByAssistant: data.createByAssistant ?? false,
              aiPrompt: data.aiPrompt ?? '',
            },
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  onSave(value: IssueTemplateValue) {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.issueTemplateApiService
      .updateIssueTemplate(this.issueTemplateId(), value)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Шаблон успешно сохранен',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Ошибка при сохранении шаблона',
          });
        },
        complete: () => {
          this.saving.set(false);
        },
      });
  }

  onCancel() {
    this.router.navigate(['../'], {
      relativeTo: this.route,
    });
  }
}
