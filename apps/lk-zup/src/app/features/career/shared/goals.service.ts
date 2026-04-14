import { computed, inject, Injectable, signal } from '@angular/core';
import { GoalsApiService } from '@features/career/shared/goals-api.service';
import { GetGoalsResult, GoalForm } from '@features/career/shared/types';
import { signalProcess } from '@shared/services/signal-helpers/signal-process';
import { SharedStateService } from '@shared/states/shared-state.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private goalsApiService = inject(GoalsApiService);

  private sharedState = inject(SharedStateService);

  loading = signal(false);

  data = signal<GetGoalsResult>(null);

  goals = signal<GoalForm[]>([]);

  hasPendingGoals = computed(() => {
    return this.goals().some((i) => i.status?.approve);
  });

  hasMinimum = computed(() => {
    let hasMin = true;
    this.data().Goals.forEach((category) => {
      if (category.min_amount) {
        const goalsLength = this.goals().filter(
          (goal) =>
            goal.categoryID === category.categoryID &&
            !goal.isDeleted &&
            goal.isEditable,
        ).length;
        hasMin = hasMin && goalsLength >= category.min_amount;
      }
    });
    return hasMin;
  });

  hasDraftGoals = computed(() => this.goals().some((i) => i.draft));

  canAdd = computed(() => !this.hasPendingGoals());

  categories = computed(() => {
    return this.data().Goals.map((cat) => ({
      ...cat,
      goals: this.goals().filter((goal) => goal.categoryID === cat.categoryID),
    }));
  });

  isTouched = computed(() => {
    return this.goals().some((i) => i.isAdded || i.isEdited || i.isDeleted);
  });

  isSubmitted = signal(false);

  canSubmit = computed(() => {
    const isTouched = this.isTouched();
    const hasPendingGoals = this.hasPendingGoals();
    const hasDraftGoals = this.hasDraftGoals();
    const hasMinimum = this.hasMinimum();

    // отправка доступна если есть изменения или есть цели в статусе черновик
    return (isTouched || (!hasPendingGoals && hasDraftGoals)) && hasMinimum;
  });

  canSave = computed(() => !this.isSubmitted());

  submit = signalProcess(async () => {
    // const isSubmitted = this.isSubmitted();
    //
    // // если еще не отправлено, то сохраняем и отправляем
    // if (!isSubmitted) {
    await this.submitAllGoals();
    // } else {
    //   await this.submitChangedGoals();
    // }
    //
    this.isSubmitted.set(true);
  });

  save = signalProcess(() => {
    return this.goalsApiService.save(
      this.goals().filter((goal) => goal.isEditable),
    );
  });

  private async submitChangedGoals() {
    // // если отправлено хоть один раз, то отправляем только новые цели
    // const newGoals = this.goals().filter((i) => i.isAdded);
    //
    // // если есть новые цели, то сначала сохраняем их
    // if (newGoals.length) {
    //   await firstValueFrom(this.goalsApiService.save(this.goals().filter((goal) => goal.isEditable)));
    // }
    await firstValueFrom(
      this.goalsApiService.save(this.goals().filter((goal) => goal.isEditable)),
    );

    // await firstValueFrom(
    //   this.goalsApiService.createGoalIssue(
    //     this.goals().filter(
    //       (i) => (i.isAdded || i.isEdited || i.isDeleted) && i.isEditable,
    //     ),
    //   ),
    // );

    await firstValueFrom(
      this.goalsApiService.createGoalIssue(
        this.goals().filter((goal) => goal.isEditable),
      ),
    );
  }

  private async submitAllGoals() {
    await firstValueFrom(
      this.goalsApiService.save(this.goals().filter((goal) => goal.isEditable)),
    );
    return firstValueFrom(
      this.goalsApiService.createGoalIssue(
        this.goals().filter((goal) => goal.isEditable),
      ),
    );
  }

  canEditGoal(goal: GoalForm) {
    return false;
  }

  canDeleteGoal(goal: GoalForm) {
    console.log('goal', goal);
    return true;
  }

  fetch() {
    this.loading.set(true);

    this.goalsApiService.getGoals().subscribe({
      next: (data) => {
        this.setFromServer(data);
        this.loading.set(false);
      },
    });
  }

  private setFromServer(data: GetGoalsResult) {
    this.data.set({
      ...data,
      Goals: data.Goals.map((i) => ({ ...i, goals: [] })),
    });

    const statuses = this.sharedState.issueStatusMap();

    this.goals.set(
      data.Goals.map((cat) =>
        cat.goals.map((goal) => ({
          ...goal,
          categoryID: cat.categoryID,
          isDeleted: false,
          isEdited: false,
          isAdded: false,
          status: statuses[goal.state],
        })),
      ).flat(),
    );

    // если draft=false, значит уже отправлено руководителю
    this.isSubmitted.set(!this.data().Draft);
  }

  addOne(goal: GoalForm) {
    this.goals.update((all) => {
      return [goal, ...all];
    });
  }

  updateOne(goal: GoalForm) {
    this.goals.update((all) => {
      return all.map((i) => (i.goalID === goal.goalID ? { ...goal } : i));
    });
  }
}
