import { Component, Input } from '@angular/core';
import { SalariesDashboardIncomeInterface } from '../../models/salaries-dashboard-income.interface';

@Component({
    selector: 'app-salaries-dashboard-income',
    templateUrl: './salaries-dashboard-income.component.html',
    styleUrls: ['./salaries-dashboard-income.component.scss'],
    standalone: false
})
export class SalariesDashboardIncomeComponent {
  @Input() textShow: string;

  @Input() loading: boolean;

  @Input() averageIncome: SalariesDashboardIncomeInterface;
}
