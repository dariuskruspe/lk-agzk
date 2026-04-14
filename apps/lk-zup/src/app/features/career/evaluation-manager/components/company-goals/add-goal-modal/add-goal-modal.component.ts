import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeFormUtilsModule } from '@root/libs/prime-form-utils/prime-form-utils.module';
import { FormUtils } from '@root/libs/prime-form-utils/utils/form-utils';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { firstValueFrom } from 'rxjs';
import { OptionListService } from '@shared/features/option-list/services/option-list.service';
import { OptionListItemInterface } from '@shared/features/option-list/models/option-list.interface';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogDataInterface,
} from '../confirmation-dialog/confirmation-dialog.component';

interface GoalCategory {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-goal-modal',
  imports: [
    CommonModule,
    PrimeFormUtilsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    Button,
    InputTextareaModule,
  ],
  templateUrl: './add-goal-modal.component.html',
  styleUrl: './add-goal-modal.component.scss',
  standalone: true,
})
export class AddGoalModalComponent implements OnInit {
  config =
    inject<DynamicDialogConfig<AddGoalModalDataInterface>>(DynamicDialogConfig);

  ref = inject(DynamicDialogRef);

  dialogService = inject(DialogService);

  optionListService = inject(OptionListService);

  form = new FormGroup({
    performerID: new FormControl<string>('', [Validators.required]),
    title: new FormControl<string>('', [Validators.required]),
    categoryID: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  loading = signal(false);

  isEditMode = computed(() => !!this.config.data?.goal);

  goalType = computed(() => this.config.data?.goalType || 'company');

  canDelete = signal(false);

  categories = signal<GoalCategory[]>([]);

  performers = signal<GoalCategory[]>([]);

  async ngOnInit() {
    // Загружаем списки из API
    await Promise.all([this.loadCategories(), this.loadPerformers()]);

    const data = this.config.data;
    if (data?.goal) {
      // Заполняем форму данными существующей цели
      this.form.patchValue({
        performerID: data.goal.performerID || '',
        title: data.goal.title,
        categoryID: data.goal.categoryID,
        description: data.goal.description || '',
      });
      this.canDelete.set(data.canDelete || false);
    } else if (data?.defaultPerformerID) {
      // Устанавливаем значение по умолчанию для новой цели
      this.form.patchValue({
        performerID: data.defaultPerformerID,
      });
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      const optionListData = await firstValueFrom(
        this.optionListService.showOptionList({ alias: 'goalsType' }),
      );

      if (optionListData?.optionList) {
        const categoriesList = optionListData.optionList.map(
          (item: OptionListItemInterface) => ({
            label: item.representation || item.title || String(item.value),
            value: String(item.value),
          }),
        );
        this.categories.set(categoriesList);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  private async loadPerformers(): Promise<void> {
    try {
      const alias =
        this.goalType() === 'company'
          ? 'generalGoalOrganization'
          : 'generalGoalDivision';

      const optionListData = await firstValueFrom(
        this.optionListService.showOptionList({ alias }),
      );

      if (optionListData?.optionList) {
        const performersList = optionListData.optionList.map(
          (item: OptionListItemInterface) => ({
            label: item.representation || item.title || String(item.value),
            value: String(item.value),
          }),
        );
        this.performers.set(performersList);
      }
    } catch (error) {
      console.error('Error loading performers:', error);
    }
  }

  onSave() {
    FormUtils.touchForm(this.form);
    if (!this.form.valid) {
      return;
    }

    // Если режим редактирования, показываем подтверждение
    if (this.isEditMode()) {
      const confirmRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: 'Подтверждение',
        width: '500px',
        data: {
          message: 'Вы уверены, что хотите сохранить изменения?',
          confirmButtonText: 'Сохранить',
          cancelButtonText: 'Отменить',
        } as ConfirmationDialogDataInterface,
      });

      confirmRef.onClose.subscribe((confirmed) => {
        if (confirmed) {
          this.saveGoal();
        }
      });
    } else {
      this.saveGoal();
    }
  }

  private saveGoal() {
    this.loading.set(true);

    setTimeout(() => {
      const selectedCategory = this.categories().find(
        (cat) => cat.value === this.form.value.categoryID,
      );

      this.ref.close({
        action: this.isEditMode() ? 'update' : 'create',
        title: this.form.value.title,
        category: selectedCategory?.label || '',
        categoryID: this.form.value.categoryID,
        description: this.form.value.description,
        performerID: this.form.value.performerID || '',
      });
      this.loading.set(false);
    }, 300);
  }

  onDelete() {
    const confirmRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: 'Подтверждение',
      width: '500px',
      data: {
        message: 'Вы уверены, что хотите удалить цель?',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отменить',
      } as ConfirmationDialogDataInterface,
    });

    confirmRef.onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.ref.close({
          action: 'delete',
        });
      }
    });
  }

  onCancel() {
    this.ref.close();
  }
}

export interface AddGoalModalDataInterface {
  goalType: 'company' | 'department';
  goal?: {
    goalID?: string;
    title: string;
    category: string;
    categoryID: string;
    description?: string;
    performerID?: string;
  };
  canDelete?: boolean;
  defaultPerformerID?: string;
}
