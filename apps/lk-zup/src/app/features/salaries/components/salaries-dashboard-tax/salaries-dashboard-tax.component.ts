import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IssuesStatusInterface } from '../../../issues/models/issues.interface';
import { TaxListInterface } from '../../models/salaries-tax.interface';

@Component({
    selector: 'app-salaries-dashboard-tax',
    templateUrl: './salaries-dashboard-tax.component.html',
    styleUrls: ['./salaries-dashboard-tax.component.scss'],
    standalone: false
})
export class SalariesDashboardTaxComponent {
  @Input() taxList: TaxListInterface;

  @Input() loading: boolean;

  @Input() taxStateList: IssuesStatusInterface;

  @Output() goDetails = new EventEmitter<string>();

  onGoDetails(id: string): void {
    this.goDetails.emit(id);
  }
}
