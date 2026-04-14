import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { injectResource } from '@app/shared/services/api-resource';
import { CustomReportsResource } from '@app/features/dashboard/resources/custom-reports.resource';
import { DashboardWorkPeriod } from '@app/features/dashboard/models/dashboard-payslip.interface';
import { UserStateService } from '@app/shared/states/user-state.service';
import { inject, Injectable } from '@angular/core';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { DashboardPayslipInterface } from '@app/features/dashboard/models/dashboard-payslip.interface';
import { IssuesAddDialogContainerComponent } from '@app/features/issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IssuesShowContainerComponent } from '@app/features/issues/containers/issues-show-container/issues-show-container.component';

@Injectable({
  providedIn: 'root',
})
export class DashboardV2Service {
  private dialogService = inject(DialogService);
  private http = inject(HttpClient);
  private userStateService = inject(UserStateService);
  private customReportsResource = injectResource(CustomReportsResource);

  getWorkPeriods() {
    return this.customReportsResource.asObservable(
      this.userStateService.activeEmployeeId(),
      'payslip',
    );
  }

  getPayslip(date?: string): Observable<DashboardPayslipInterface> {
    let httpParams = new HttpParams();
    if (date) {
      httpParams = httpParams.append('date', date);
    }
    return this.http.get<DashboardPayslipInterface>(
      `${Environment.inv().api}/wa_employee/${this.userStateService.activeEmployeeId()}/payslip`,
      { params: httpParams },
    );
  }

  openIssueAddDialog(data: { alias?: string; id?: string; formData: unknown }) {
    this.dialogService.open(IssuesAddDialogContainerComponent, {
      width: '1065px',
      data,
      closable: true,
    });
  }

  openIssueShowDialog(id: string) {
    const dialog = this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId: id },
      closable: true,
      dismissableMask: true,
    });
    return dialog;
  }
}
