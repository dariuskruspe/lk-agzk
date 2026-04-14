import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { EvaluationApiService } from '@features/career/shared/evaluation-api.service';
import { firstValueFrom, Observable } from 'rxjs';
import { EvaluationsSubordinatesListInterface } from '@features/career/shared/types';
import { Router } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import { EmployeeSuccessorInterface } from '@features/successors/models/successors.interface';
import {
  EVALUATION_EMPLOYEE_DATA_CONFIG,
  EVALUATION_EMPLOYEE_ITEM_LAYOUT,
} from '@features/career/evaluation-manager/constants/evaluation-employee-data-config';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProgressBar } from 'primeng/progressbar';
import { CompanyGoalsComponent } from './components/company-goals/company-goals.component';

@Component({
    selector: 'app-evaluation-manager-container',
    imports: [
      CommonModule,
      LangModule,
      LoadableListModule,
      ToolbarModule,
      CompanyGoalsComponent,
    ],
    templateUrl: './evaluation-manager-container.component.html',
    styleUrl: './evaluation-manager-container.component.scss',
    providers: [providePreloader(ProgressBar)],
    standalone: true,
})
export class EvaluationManagerContainerComponent implements OnInit {
  private preloader = inject(Preloader);

  dataTemplate = EVALUATION_EMPLOYEE_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...EVALUATION_EMPLOYEE_DATA_CONFIG];

  evaluationList: EvaluationsSubordinatesListInterface;

  evaluationNeedAttentionList: EvaluationsSubordinatesListInterface;

  activeTab: 'TEAM_GOALS' | 'NEED_ATTENTION' = 'TEAM_GOALS';

  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  currentPage = 1;

  nameSection = signal<string>('');

  constructor(
    private evaluationApiService: EvaluationApiService,
    private router: Router,
    private ref: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.preloader.setCondition(this.loading$);
    this.getEvaluationList({
      count: 15,
      page: 1,
      useSkip: false,
    }).then(() => {
      this.loading.set(false);
    });
  }

  async getEvaluationList(param: FilterParamsInterface): Promise<void> {
    this.evaluationList = await firstValueFrom(
      this.evaluationApiService.getEvaluationsSubordinates(param),
    );
    const requiresAttention = this.evaluationList.subordinates.filter(
      (sub) => sub.requiresAttention,
    );
    this.evaluationNeedAttentionList = {
      subordinates: requiresAttention,
      count: requiresAttention.length,
      page: 1,
      useSkip: false,
    };
    this.ref.detectChanges();
  }

  onLoadList(param: FilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.getEvaluationList(param).then(() => {});
    }
  }

  onSuccessorItem(data: EmployeeSuccessorInterface) {
    this.router.navigate(['', 'evaluation-manager', data.employeeID]).then();
  }

  changeTab(tabName: 'TEAM_GOALS' | 'NEED_ATTENTION'): void {
    this.activeTab = tabName;
  }

  setNameSection(name: string): void {
    this.nameSection.set(name);
  }
}
