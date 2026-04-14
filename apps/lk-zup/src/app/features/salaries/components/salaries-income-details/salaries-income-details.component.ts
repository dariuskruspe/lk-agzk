import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalariesDashboardIncomeInterface } from '../../models/salaries-dashboard-income.interface';

@Component({
    selector: 'app-salaries-income-details',
    templateUrl: './salaries-income-details.component.html',
    styleUrls: ['./salaries-income-details.component.scss'],
    standalone: false
})
export class SalariesIncomeDetailsComponent {
  textShow = false;

  issuesViewToggle: SalariesDashboardIncomeInterface = {};

  @Input() averageIncome: SalariesDashboardIncomeInterface;

  @Output() textDisplayChange = new EventEmitter();

  onTextDisplayChange(): void {
    this.textShow = !this.textShow;
    this.textDisplayChange.emit();
  }

  onIssuesViewToggle(type: string): void {
    this.issuesViewToggle[type] = !this.issuesViewToggle[type];
  }
}
