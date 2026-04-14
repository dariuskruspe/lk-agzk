import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoalsService } from '@features/career/shared/goals.service';
import { GoalCategory, GoalForm } from '@features/career/shared/types';
import { PrimeFormUtilsModule } from '@root/libs/prime-form-utils/prime-form-utils.module';
import { FormUtils } from '@root/libs/prime-form-utils/utils/form-utils';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { v4 as uuid } from 'uuid';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-goal-form-modal',
    imports: [
        CommonModule,
        PrimeFormUtilsModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextModule,
        Button,
        InputTextareaModule,
    ],
    templateUrl: './goal-form-modal.component.html',
    styleUrl: './goal-form-modal.component.scss'
})
export class GoalFormModalComponent {
  config =
    inject<DynamicDialogConfig<GoalFormModalDataInterface>>(
      DynamicDialogConfig,
    );

  ref = inject(DynamicDialogRef);

  goals = inject(GoalsService);

  form = new FormGroup({
    category: new FormControl<string>('', [Validators.required]),
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
  });

  loading = signal(false);

  data = signal<GoalFormModalDataInterface | null>(null);

  isEdit = computed(() => !!this.data()?.goal);

  categories = computed(() => this.data()?.categories || []);

  ngOnInit() {
    this.data.set(this.config.data);

    const { goal, cat } = this.data();

    if (goal) {
      this.form.patchValue({
        category: cat.categoryID,
        title: goal.name,
        description: goal.description,
      });
    } else {
      this.form.patchValue({ category: cat.categoryID });
    }
  }

  onSave() {
    FormUtils.touchForm(this.form);
    if (!this.form.valid) {
      return;
    }

    if (this.isEdit()) {
      this.goals.updateOne({
        ...this.data().goal,
        ...this.getForm(),
        isDeleted: false,
        isEdited: true,
        isAdded: false,
      });
    } else {
      this.goals.addOne({
        goalID: uuid(),
        ...this.getForm(),
        isDeleted: false,
        isEdited: false,
        isAdded: true,
        status: null,
        draft: true,
        isEditable: true,
      });
    }

    this.ref.close();
  }

  onCancel() {
    this.ref.close();
  }

  private getForm() {
    return {
      name: this.form.value.title,
      description: this.form.value.description ?? '',
      categoryID: this.form.value.category,
    };
  }
}

export interface GoalFormModalDataInterface {
  categories: GoalCategory[];
  cat: GoalCategory;
  goal?: GoalForm;
}
