import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { StepsOptionsInterface } from '@shared/interfaces/steps/options/steps-options.interface';
import { StepsHelperService } from '@shared/services/steps/steps-helper.service';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { InputTextModule } from 'primeng/inputtext';
import { ItemListModule } from '@shared/components/item-list/item-list.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { StatusModule } from '@shared/components/issue-status/status.module';
import { TabViewModule } from 'primeng/tabview';
import { EvaluationFormComponent } from '@features/career/evaluation/components/evaluation-form/evaluation-form.component';
import {
  ApprovalEvaluationInterface,
  EvaluationFormValueInterface,
  EvaluationInterface,
  evaluationRatingsListInterface,
} from '@features/career/shared/types';
import { EvaluationApiService } from '@features/career/shared/evaluation-api.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProgressBar } from 'primeng/progressbar';

@Component({
    selector: 'app-evaluation-item-container',
    imports: [
        CommonModule,
        StepsComponent,
        CardModule,
        FormsModule,
        FpcModule,
        InputTextModule,
        ItemListModule,
        LangModule,
        StatusModule,
        TabViewModule,
        EvaluationFormComponent,
    ],
    templateUrl: './evaluation-item-container.component.html',
    styleUrl: './evaluation-item-container.component.scss',
    providers: [StepsHelperService, providePreloader(ProgressBar)]
})
export class EvaluationItemContainerComponent implements OnInit {
  private preloader = inject(Preloader);

  steps: StepInterface[] = [];

  stepsOptions: StepsOptionsInterface = this.stepsHelper.initialOptions();

  evaluationItem: WritableSignal<EvaluationInterface> = signal(null);

  isManager: WritableSignal<boolean> = signal(false);

  ratingList: WritableSignal<evaluationRatingsListInterface> = signal({
    evaluationRatings: [],
  });

  loading = signal(true);

  nextStageAvailable = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  constructor(
    private stepsHelper: StepsHelperService,
    private evaluationApiService: EvaluationApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.preloader.setCondition(this.loading$);
    const evaluationId = this.route.snapshot.params.id;
    const employeeId = this.route.snapshot.params.employeeId;
    this.isManager.set(!!employeeId);
    this.getEvaluationById(evaluationId).then(() => {
      this.getSteps();
      this.loading.set(false);
    });
  }

  getSteps() {
    this.steps = this.evaluationItem().stages.map((stage, index) => {
      const activeIndex = this.evaluationItem().stages.findIndex(
        (st) => st.isCurrent,
      );
      const isPreviousStep = index < activeIndex;
      return {
        id: stage.stageName,
        active: stage.isCurrent,
        highlight: isPreviousStep,
        title: stage.stageName,
        description: stage.description,
        icon: 'pi-check',
      };
    });
  }

  async getEvaluationById(id: string) {
    const result = await firstValueFrom(
      this.evaluationApiService.getEvaluationById(id),
    );
    const evaluation = this.setOpened(result.evaluation);
    this.nextStageAvailable.set(evaluation.nextStageAvailable);
    this.evaluationItem.set(evaluation);
    if (evaluation.useRatings) {
      this.getOptions().then(() => {});
    }
  }

  setOpened(evaluationItem: EvaluationInterface): EvaluationInterface {
    const newCategories = evaluationItem.categories.map((cat) => {
      return {
        ...cat,
        open: true,
      };
    });
    return {
      ...evaluationItem,
      categories: newCategories,
    };
  }

  async getOptions() {
    const result = await firstValueFrom(this.evaluationApiService.getRatings());
    this.ratingList.set(result);
  }

  async submitForm(formValue: EvaluationFormValueInterface) {
    this.loading.set(true);
    await firstValueFrom(
      this.evaluationApiService.sendFormValue(
        this.evaluationItem().evaluationID,
        formValue,
      ),
    );
    this.getEvaluationById(this.evaluationItem().evaluationID).then(() => {
      this.getSteps();
    });
    this.loading.set(false);
  }

  async approve(approveData: ApprovalEvaluationInterface) {
    this.loading.set(true);
    const result = await firstValueFrom(
      this.evaluationApiService.approveEvaluation(
        this.evaluationItem().evaluationID,
        approveData,
      ),
    );
    const evaluation = this.setOpened(result.evaluation);
    this.nextStageAvailable.set(evaluation.nextStageAvailable);
    this.evaluationItem.set(evaluation);
    if (evaluation.useRatings) {
      this.getOptions().then(() => {
        this.getSteps();
      });
    }
    this.loading.set(false);
  }

  async nextStage() {
    this.loading.set(true);
    const result = await firstValueFrom(
      this.evaluationApiService.nextStageEvaluation(
        this.evaluationItem().evaluationID,
      ),
    );
    const evaluation = this.setOpened(result.evaluation);
    this.nextStageAvailable.set(evaluation.nextStageAvailable);
    this.evaluationItem.set(evaluation);
    this.getSteps();
    if (evaluation.useRatings) {
      this.getOptions().then(() => {});
    }
    this.loading.set(false);
  }
}
