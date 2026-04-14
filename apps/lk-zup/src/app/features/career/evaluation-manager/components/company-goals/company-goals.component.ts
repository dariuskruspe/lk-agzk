import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom, Observable } from 'rxjs';
import { EvaluationApiService } from '@features/career/shared/evaluation-api.service';
import {
  GeneralGoalInterface,
  GeneralGoalsSectionInterface,
} from '@features/career/shared/types';
import {
  AddGoalModalComponent,
  AddGoalModalDataInterface,
} from './add-goal-modal/add-goal-modal.component';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-company-goals',
  imports: [CommonModule, ButtonModule],
  templateUrl: './company-goals.component.html',
  styleUrl: './company-goals.component.scss',
  providers: [providePreloader(ProgressBar)],
  standalone: true,
})
export class CompanyGoalsComponent implements OnInit {
  private dialogService = inject(DialogService);
  private evaluationApiService = inject(EvaluationApiService);
  private preloader = inject(Preloader);
  // private localStorageService = inject(LocalStorageService);
  // private mainCurrentUserFacade = inject(MainCurrentUserFacade);

  companyGoalsSection = signal<GeneralGoalsSectionInterface | null>(null);
  departmentGoalsSection = signal<GeneralGoalsSectionInterface | null>(null);
  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  @Output() setNameSection: EventEmitter<string> = new EventEmitter<string>();

  get companyGoals(): GeneralGoalInterface[] {
    return this.companyGoalsSection()?.goals || [];
  }

  get departmentGoals(): GeneralGoalInterface[] {
    return this.departmentGoalsSection()?.goals || [];
  }

  get canAddCompanyGoal(): boolean {
    return this.companyGoalsSection()?.addingAvailable || false;
  }

  get canAddDepartmentGoal(): boolean {
    return this.departmentGoalsSection()?.addingAvailable || false;
  }

  async ngOnInit(): Promise<void> {
    this.preloader.setCondition(this.loading$);
    await this.loadGoals();
  }

  private async loadGoals(): Promise<void> {
    try {
      this.loading.set(true);

      const goalsData = await firstValueFrom(
        this.evaluationApiService.getGeneralGoals(),
      );

      if (goalsData.organizationGoals) {
        this.companyGoalsSection.set(goalsData.organizationGoals);
      }
      if (goalsData.divisionGoals) {
        this.departmentGoalsSection.set(goalsData.divisionGoals);
      }
      this.setNameSection.emit(goalsData.sectionName || '');
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // private getOrganizationID(): string {
  //   const currentEmployee = this.mainCurrentUserFacade.getCurrentEmployee();
  //   return currentEmployee?.organizationID || '';
  // }

  // private getDivisionID(): string {
  //   // Для division используем employeeID как performerID
  //   // так как divisionID может быть недоступен напрямую
  //   const employeeID = this.localStorageService.getCurrentEmployeeId();
  //   return employeeID || '';
  // }

  async onGoalClick(
    goal: GeneralGoalInterface,
    goalType: 'company' | 'department',
  ): Promise<void> {
    const section =
      goalType === 'company'
        ? this.companyGoalsSection()
        : this.departmentGoalsSection();

    if (!section?.editingAvailable) {
      return;
    }

    // Загружаем полные данные цели для получения performerID
    let performerID: string = '';
    try {
      const fullGoalData = await firstValueFrom(
        this.evaluationApiService.getGeneralGoalById(goal.goalID),
      );
      performerID = fullGoalData.performerID;
    } catch (error) {
      console.error('Error loading goal details:', error);
    }

    const dialogRef = this.dialogService.open(AddGoalModalComponent, {
      header:
        goalType === 'company'
          ? 'Редактировать цель компании'
          : 'Редактировать цель подразделения',
      width: '700px',
      data: {
        goalType,
        goal: {
          goalID: goal.goalID,
          title: goal.goalName,
          category: goal.categoryName,
          categoryID: goal.categoryID,
          description: goal.description,
          performerID,
        },
        canDelete: section.deletionAvailable,
      } as AddGoalModalDataInterface,
    });

    dialogRef.onClose.subscribe(async (result) => {
      if (result) {
        if (result.action === 'delete') {
          await this.deleteGoal(goal.goalID);
        } else if (result.action === 'update') {
          await this.updateGoal(goal.goalID, result, goalType);
        }
      }
    });
  }

  private async updateGoal(
    goalID: string,
    newData: {
      title: string;
      category: string;
      categoryID: string;
      description?: string;
      performerID: string;
    },
    goalType: 'company' | 'department',
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.evaluationApiService.createOrUpdateGeneralGoal({
          goalID,
          name: newData.title,
          description: newData.description || '',
          categoryID: newData.categoryID,
          performerType: goalType === 'company' ? 'organization' : 'division',
          performerID: newData.performerID,
        }),
      );

      await this.loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  }

  private async deleteGoal(goalID: string): Promise<void> {
    try {
      await firstValueFrom(this.evaluationApiService.deleteGeneralGoal(goalID));
      await this.loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }

  onAddCompanyGoal(): void {
    if (!this.canAddCompanyGoal) {
      return;
    }

    const defaultPerformerID = this.companyGoalsSection()?.defaultPerformerID;

    const dialogRef = this.dialogService.open(AddGoalModalComponent, {
      header: 'Добавить цель компании',
      width: '700px',
      data: {
        goalType: 'company',
        defaultPerformerID,
      } as AddGoalModalDataInterface,
    });

    dialogRef.onClose.subscribe(async (result) => {
      if (result && result.action === 'create') {
        await this.createGoal(result, 'company');
      }
    });
  }

  onAddDepartmentGoal(): void {
    // if (!this.canAddDepartmentGoal) {
    //   return;
    // }

    const defaultPerformerID =
      this.departmentGoalsSection()?.defaultPerformerID;

    const dialogRef = this.dialogService.open(AddGoalModalComponent, {
      header: 'Добавить цель подразделения',
      width: '700px',
      data: {
        goalType: 'department',
        defaultPerformerID,
      } as AddGoalModalDataInterface,
    });

    dialogRef.onClose.subscribe(async (result) => {
      if (result && result.action === 'create') {
        await this.createGoal(result, 'department');
      }
    });
  }

  private async createGoal(
    data: {
      title: string;
      category: string;
      categoryID: string;
      description?: string;
      performerID: string;
    },
    goalType: 'company' | 'department',
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.evaluationApiService.createOrUpdateGeneralGoal({
          name: data.title,
          description: data.description || '',
          categoryID: data.categoryID,
          performerType: goalType === 'company' ? 'organization' : 'division',
          performerID: data.performerID,
        }),
      );

      await this.loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  }
}
