import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { LangModule } from '@shared/features/lang/lang.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import {
  ApprovalEvaluationInterface,
  EvaluationFormValueInterface,
  EvaluationInterface,
  evaluationRatingsListInterface,
} from '@features/career/shared/types';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EvaluationFileUploadComponent } from '@features/career/evaluation/components/evaluation-file-upload/evaluation-file-upload.component';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';

@Component({
  selector: 'app-evaluation-form',
  imports: [
    CommonModule,
    FormsModule,
    ButtonDirective,
    LangModule,
    InputTextModule,
    Button,
    ToolbarModule,
    InputTextareaModule,
    ReactiveFormsModule,
    EvaluationFileUploadComponent,
    DropdownModule,
  ],
  templateUrl: './evaluation-form.component.html',
  styleUrl: './evaluation-form.component.scss',
  providers: [],
  standalone: true,
})
export class EvaluationFormComponent implements OnChanges {
  @Input() evaluation: EvaluationInterface;
  @Input() ratingList: evaluationRatingsListInterface;
  @Input() isManager: boolean = false;

  @Output() submitForm: EventEmitter<EvaluationFormValueInterface> =
    new EventEmitter<EvaluationFormValueInterface>();
  @Output() approve: EventEmitter<ApprovalEvaluationInterface> =
    new EventEmitter<ApprovalEvaluationInterface>();
  @Output() nextStage: EventEmitter<void> = new EventEmitter();

  formValue: EvaluationFormValueInterface;

  approvalComment: string;

  showDocuments = true;

  showAgreement = true;

  showOverallRating = true;

  overallManagerRatingList: WritableSignal<
    {
      categoryID: string;
      attributeID: string;
      attributeName: string;
      ratingID: string;
      ratingValue: number;
    }[]
  > = signal([]);

  overallEmployeeRatingList: WritableSignal<
    {
      categoryID: string;
      attributeID: string;
      attributeName: string;
      ratingID: string;
      ratingValue: number;
    }[]
  > = signal([]);

  showError = false;

  confirmation = true;

  confirmationService = inject(ConfirmationService);

  translatePipe = inject(TranslatePipe);

  constructor(private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.evaluation?.currentValue) {
      this.createFormValue();
    }
    if (changes.ratingList?.currentValue?.evaluationRatings?.length) {
      if (this.evaluation?.useRatings && this.evaluation?.categories) {
        this.evaluation.categories.forEach((category) => {
          if (category.managerRating?.ratingID) {
            this.changeRating(
              category.managerRating.ratingID,
              category.categoryID,
              true,
            );
          }
          if (category.employeeRating?.ratingID) {
            this.changeRating(
              category.employeeRating.ratingID,
              category.categoryID,
              false,
            );
          }
        });
      }
    }
  }

  createFormValue() {
    this.formValue = {
      isDraft: false,
      categories: this.evaluation.categories.map((cat) => {
        return {
          categoryID: cat.categoryID,
          employeeResult: cat.employeeResult?.result || '',
          managerResult: cat.managerResult?.result || '',
          employeeRating: cat.employeeRating?.ratingID || '',
          managerRating: cat.managerRating?.ratingID || '',
          goals: cat.goals.map((goal) => {
            return {
              goalID: goal.goalID,
              employeeResult: goal.employeeResult?.result || '',
              managerResult: goal.managerResult?.result || '',
            };
          }),
        };
      }),
      files: [],
      filesToDelete: [],
    };
    this.confirmation = this.evaluation.meetingConfirmationAvailable
      ? true
      : this.evaluation.meetingConfirmation;
  }

  changeFiles(
    files: {
      fileName: string;
      file64: string | ArrayBuffer;
      icon: string;
      fileID: string;
      fileLink;
    }[],
  ): void {
    this.evaluation.files.forEach((file) => {
      if (
        file.fileID &&
        files.findIndex((newFile) => newFile.fileID === file.fileID) === -1 &&
        this.formValue.filesToDelete.findIndex((id) => id === file.fileID) ===
          -1
      ) {
        this.formValue.filesToDelete.push(file.fileID);
      }
    });
    this.formValue.files = files.filter((file) => file.file64);
  }

  onSubmit() {
    if (this.isValidForm()) {
      const value = this.mapValue();
      this.submitForm.emit(value);
    } else {
      this.showError = true;
    }
  }

  onSubmitDraft() {
    this.formValue.isDraft = true;
    const value = this.mapValue();
    this.submitForm.emit(value);
  }

  mapValue(): EvaluationFormValueInterface {
    const value = { ...this.formValue };
    if (this.evaluation.meetingConfirmationAvailable) {
      value.meetingConfirmation = this.confirmation;
    }
    value.categories = value.categories.map((cat) => {
      const category = { ...cat };
      category.goals = category.goals.map((goal) => {
        const goalData = this.evaluation.categories
          .find((categ) => categ.categoryID === cat.categoryID)
          .goals.find((goa) => goa.goalID === goal.goalID);
        return {
          ...goal,
          result: goalData.employeeResult.editingAvailable
            ? goal.employeeResult
            : goal.managerResult,
        };
      });
      category.result = this.isManager ? cat.managerResult : cat.employeeResult;
      category.ratingID = this.isManager
        ? cat.managerRating
        : cat.employeeRating;
      return category;
    });
    if (this.evaluation.useRatings) {
      const totalRating = this.isManager
        ? this.totalRatingManager
        : this.totalRatingEmployee;
      value.overallRatings = totalRating.map((rating) => {
        return {
          attributeID: rating.attributeID,
          ratingID: rating.ratingID,
        };
      });
    }
    return value;
  }

  backPage() {
    this.location.back();
  }

  approveEvaluation(isApprove: boolean) {
    this.approve.emit({ approved: isApprove, comment: this.approvalComment });
  }

  changeRating(ratingId: string, categoryId: string, manager: boolean) {
    const ratingValues = [
      ...(manager
        ? this.overallManagerRatingList()
        : this.overallEmployeeRatingList()),
    ];
    const cat = this.evaluation.categories.find(
      (formCat) => formCat.categoryID === categoryId,
    );
    if (ratingId) {
      const ratingValue = this.ratingList.evaluationRatings.find(
        (rating) => rating.ratingID === ratingId,
      );
      const ratingItem = {
        categoryID: cat.categoryID,
        attributeID: cat.attributeID,
        attributeName: cat.attributeName,
        ratingID: ratingValue.ratingID,
        ratingValue: +ratingValue.value,
      };
      const indexPrevVakue = ratingValues.findIndex(
        (rating) => rating.categoryID === categoryId,
      );
      if (indexPrevVakue !== -1) {
        ratingValues.splice(indexPrevVakue, 1);
      }
      if (ratingValue.value) {
        ratingValues.push(ratingItem);
      }
    }
    this.formValue.categories.find(
      (formCat) => formCat.categoryID === categoryId,
    )[manager ? 'managerRating' : 'employeeRating'] = ratingId;
    if (manager) {
      this.overallManagerRatingList.set(ratingValues);
    } else {
      this.overallEmployeeRatingList.set(ratingValues);
    }
  }

  isValidForm(): boolean {
    let res = true;
    const fieldName = !this.isManager ? 'employeeResult' : 'managerResult';
    this.formValue.categories.forEach((category) => {
      const evaluationCategory = this.evaluation.categories.find(
        (cat) => cat.categoryID === category.categoryID,
      );
      if (!evaluationCategory) {
        return;
      }
      category.goals.forEach((goal) => {
        const evaluationGoal = evaluationCategory.goals.find(
          (g) => g.goalID === goal.goalID,
        );
        if (!evaluationGoal) {
          return;
        }
        // Проверяем, является ли поле disabled (недоступным для редактирования)
        const isFieldDisabled =
          !this.evaluation.editingAvailable ||
          (fieldName === 'employeeResult'
            ? !evaluationGoal.employeeResult?.editingAvailable
            : !evaluationGoal.managerResult?.editingAvailable);

        // Если поле НЕ disabled (доступно для редактирования), то оно обязательное
        // и должно быть заполнено. Проверяем наличие значения.
        if (!isFieldDisabled) {
          res = res && !!goal[fieldName];
        }
        // Если поле disabled, то оно считается валидным и не требует заполнения
      });
      if (this.evaluation.useRatings) {
        if (this.isManager) {
          // Проверяем доступность редактирования рейтинга менеджера
          const isRatingDisabled =
            !this.evaluation.editingAvailable ||
            !evaluationCategory.managerRating?.editingAvailable;
          // Проверяем доступность редактирования комментария менеджера
          const isResultDisabled =
            !this.evaluation.editingAvailable ||
            !evaluationCategory.managerResult?.editingAvailable;

          // Если рейтинг доступен для редактирования, проверяем его заполнение
          if (!isRatingDisabled) {
            res = res && !!category.managerRating;
          }
          // Если комментарий доступен для редактирования, проверяем его заполнение
          if (!isResultDisabled) {
            res = res && !!category.managerResult;
          }
        } else {
          // Проверяем доступность редактирования рейтинга самооценки
          const isRatingDisabled =
            !this.evaluation.editingAvailable ||
            !evaluationCategory.employeeRating?.editingAvailable;
          // Проверяем доступность редактирования комментария самооценки
          const isResultDisabled =
            !this.evaluation.editingAvailable ||
            !evaluationCategory.employeeResult?.editingAvailable;

          // Если рейтинг доступен для редактирования, проверяем его заполнение
          if (!isRatingDisabled) {
            res = res && !!category.employeeRating;
          }
          // Если комментарий доступен для редактирования, проверяем его заполнение
          if (!isResultDisabled) {
            res = res && !!category.employeeResult;
          }
        }
      }
    });
    return res;
  }

  changeConfirmation(value: boolean) {
    if (!this.evaluation.meetingConfirmationAvailable) return;
    this.confirmation = value;
  }

  getCategoryResult(categoryIndex: number, manager: boolean): string {
    if (manager) {
      return this.formValue.categories[categoryIndex]?.managerResult || '';
    } else {
      return this.formValue.categories[categoryIndex]?.employeeResult || '';
    }
  }

  setCategoryResult(
    categoryIndex: number,
    value: string,
    manager: boolean,
  ): void {
    if (this.formValue.categories[categoryIndex]) {
      if (manager) {
        this.formValue.categories[categoryIndex].managerResult = value;
      } else {
        this.formValue.categories[categoryIndex].employeeResult = value;
      }
    }
  }

  setNextStage = (event: any) => {
    this.confirmationService.confirm({
      target: event.target,
      message:
        this.translatePipe.transform('NEXT_STAGE_CONFIRMATION_MESSAGE') ||
        'Вы действительно хотите перейти к следующему этапу оценки?',
      acceptLabel: this.translatePipe.transform('YES_BUTTON') || 'Да',
      rejectLabel: this.translatePipe.transform('NO_BUTTON') || 'Нет',
      accept: () => {
        this.nextStage.emit();
      },
    });
  };

  get totalRatingEmployee(): {
    attributeName: string;
    averageValue: number;
    attributeID: string;
    ratingID: string;
  }[] {
    let allRatings = this.overallEmployeeRatingList();
    const result = [];
    while (allRatings && allRatings.length > 0) {
      const attributeID = allRatings[0].attributeID;
      const attributeName = allRatings[0].attributeName;
      const ratingValues = allRatings.filter(
        (rating) => rating.attributeID === attributeID,
      );
      const averageValue = Math.round(
        ratingValues.reduce((acc, rating) => acc + rating.ratingValue, 0) /
          ratingValues.length,
      );
      const ratingID = this.ratingList.evaluationRatings.find(
        (r) => r.value === averageValue,
      )?.ratingID;
      result.push({ attributeName, averageValue, attributeID, ratingID });
      allRatings = allRatings.filter(
        (rating) => rating.attributeID !== attributeID,
      );
    }
    return result;
  }

  get totalRatingManager(): {
    attributeName: string;
    averageValue: number;
    attributeID: string;
    ratingID: string;
  }[] {
    let allRatings = this.overallManagerRatingList();
    const result = [];
    while (allRatings && allRatings.length > 0) {
      const attributeID = allRatings[0].attributeID;
      const attributeName = allRatings[0].attributeName;
      const ratingValues = allRatings.filter(
        (rating) => rating.attributeID === attributeID,
      );
      const averageValue = Math.round(
        ratingValues.reduce((acc, rating) => acc + rating.ratingValue, 0) /
          ratingValues.length,
      );
      const ratingID = this.ratingList.evaluationRatings.find(
        (r) => r.value === averageValue,
      )?.ratingID;
      result.push({ attributeName, averageValue, attributeID, ratingID });
      allRatings = allRatings.filter(
        (rating) => rating.attributeID !== attributeID,
      );
    }
    return result;
  }
}
