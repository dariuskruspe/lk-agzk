import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { GoalForm } from '@features/career/shared/types';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';

@Component({
    selector: 'app-goal-item',
    imports: [
        CommonModule,
        StatusModule,
        TooltipModule,
        TrustedHtmlModule,
    ],
    templateUrl: './goal-item.component.html',
    styleUrl: './goal-item.component.scss'
})
export class GoalItemComponent {
  confirmationService = inject(ConfirmationService);

  goal = input.required<GoalForm>();

  canEdit = input.required<boolean>();

  canDelete = input.required<boolean>();

  isCompleted = computed(() => false);

  edit = output();

  delete = output();

  onDelete = (event: any) => {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Вы действительно хотите удалить эту цель ?',
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
      accept: () => {
        this.delete.emit();
      },
    });
  };
}
