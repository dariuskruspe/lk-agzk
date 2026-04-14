import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IssueTemplateRepository } from '../shared/issue-template-repository';
import { IssueTemplateSettingsInterface } from '../shared/types';
import { CheckboxModule } from 'primeng/checkbox';
import { IconPickerComponent } from '../../../../../shared/components/icon-picker/icon-picker.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-issue-template-settings',
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        IconPickerComponent,
        InputTextModule,
        InputTextareaModule,
    ],
    templateUrl: './issue-template-settings.component.html',
    styleUrl: './issue-template-settings.component.scss'
})
export class IssueTemplateSettingsComponent {
  repository = input.required<IssueTemplateRepository>();

  settings = computed(() => this.repository().value().settings);

  patchSettings(settings: Partial<IssueTemplateSettingsInterface>) {
    this.repository().patchSettings(settings);
  }
}
