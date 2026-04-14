import { CommonModule } from '@angular/common';
import { Component, inject, WritableSignal } from '@angular/core';
import {
  GoalFormModalComponent,
  GoalFormModalDataInterface,
} from '@features/career/goals/goal-form-modal/goal-form-modal.component';
import { GoalItemComponent } from '@features/career/goals/goal-item/goal-item.component';
import { GoalsService } from '@features/career/shared/goals.service';
import { GoalCategory, GoalForm } from '@features/career/shared/types';
import { ZupCardModule } from '@shared/components/card/zup-card.module';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { tap } from 'rxjs/operators';
import { AppService } from '@shared/services/app.service';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';

@Component({
    selector: 'app-goals',
    imports: [
        CommonModule,
        ZupCardModule,
        GoalItemComponent,
        Button,
        MessageModule,
    ],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.scss',
    providers: []
})
export class GoalsComponent {
  private messageService = inject(MessageService);

  private dialogService = inject(DialogService);

  goals = inject(GoalsService);

  app: AppService = inject(AppService);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  ngOnInit() {
    this.goals.fetch();
  }

  openCreateDialog(cat: GoalCategory) {
    if (!this.goals.canAdd()) {
      return;
    }

    this.dialogService.open(GoalFormModalComponent, {
      header: 'Запланировать цель',
      width: '700px',
      data: {
        categories: this.goals.categories(),
        cat: cat,
      } as GoalFormModalDataInterface,
    });
  }

  onEdit(cat: GoalCategory, goal: GoalForm) {
    this.dialogService.open(GoalFormModalComponent, {
      header: 'Редактировать цель',
      width: '700px',
      data: {
        categories: this.goals.categories(),
        goal: goal,
        cat: cat,
      } as GoalFormModalDataInterface,
    });
  }

  onDelete(cat: GoalCategory, goal: GoalForm) {
    this.goals.updateOne({
      ...goal,
      isDeleted: true,
    });
  }

  onSave() {
    fromPromise(this.goals.save.exec())
      .pipe(tap(() => this.goals.fetch()))
      .subscribe();
  }

  onSubmit() {
    fromPromise(this.goals.submit.exec())
      .pipe(tap(() => this.goals.fetch()))
      .subscribe();
  }
}
