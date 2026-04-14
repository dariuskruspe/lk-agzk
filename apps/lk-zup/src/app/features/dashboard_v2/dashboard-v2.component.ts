import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { DashboardV2TasksWidgetComponent } from './widgets/dashboard-v2-tasks-widget/dashboard-v2-tasks-widget.component';
import { DashboardV2CalendarWidgetComponent } from './widgets/dashboard-v2-calendar-widget/dashboard-v2-calendar-widget.component';
import { DashboardV2SalaryWidgetComponent } from './widgets/dashboard-v2-salary-widget/dashboard-v2-salary-widget.component';
import { DashboardV2VacationWidgetComponent } from './widgets/dashboard-v2-vacation-widget/dashboard-v2-vacation-widget.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { Preloader } from '@app/shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { providePreloader } from '@app/shared/services/preloader.service';
import { Observable } from 'rxjs';
import { IWidgetComponent } from './shared/widget.interface';

@Component({
  selector: 'app-dashboard-v2',
  imports: [
    DashboardV2TasksWidgetComponent,
    DashboardV2CalendarWidgetComponent,
    DashboardV2SalaryWidgetComponent,
    DashboardV2VacationWidgetComponent,
    DashboardModule,
  ],
  templateUrl: './dashboard-v2.component.html',
  styleUrl: './dashboard-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [providePreloader(ProgressBar)],
})
export default class DashboardV2Component {
  globalSettings = inject(GlobalSettingsStateService).state;
  localStorageService = inject(LocalStorageService);
  private preloader = inject(Preloader);

  widgets = viewChildren<any>('widget');

  ngAfterViewInit() {
    // собираем все loading$ из виджетов
    const loadings = this.widgets()
      .map((widget) => widget?.loading$)
      .filter((i) => !!i);

    if (loadings.length > 0) {
      this.preloader.setCondition(...loadings);
    }
  }

  isV2Enabled = computed(() => {
    return this.globalSettings()?.dashboard.newVersion === true;
  });

  goToOldDashboard() {
    this.localStorageService.setUseOldDashboard(true);
  }
}
