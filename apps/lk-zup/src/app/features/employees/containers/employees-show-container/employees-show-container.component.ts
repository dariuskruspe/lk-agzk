import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { EmployeesCompanyEmployeeListFacade } from '../../facades/employees-company-employee-list.facade';
import { EmployeesCompanyProfileFacade } from '../../facades/employees-company-profile.facade';
import { EmployeesStateListFacade } from '../../facades/employees-state-list.facade';
import { EmployeesShowDialogContainerComponent } from '../employees-show-dialog-container/employees-show-dialog-container.component';
import { UserSettingsFacade } from '@shared/features/settings/facades/user-settings.facade';

@Component({
    selector: 'app-employees-show-container',
    templateUrl: './employees-show-container.component.html',
    styleUrls: ['./employees-show-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb(EmployeesCompanyProfileFacade, 1),
    ],
    standalone: false
})
export class EmployeesShowContainerComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private dialogService: DialogService,
    public employeesCompanyProfileFacade: EmployeesCompanyProfileFacade,
    public settingsFacade: UserSettingsFacade,
    public employeeStateListFacade: EmployeesStateListFacade,
    public employeesCompanyEmployeeListFacade: EmployeesCompanyEmployeeListFacade,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(this.employeesCompanyProfileFacade.loading$());

    this.employeesCompanyProfileFacade.getEmployeeProfile(
      this.activatedRouter?.snapshot?.params?.id
    );
    if (!this.employeeStateListFacade?.getData()) {
      this.employeeStateListFacade.getStateList();
    }
  }

  goRouteEmployee(employeeId: string): void {
    this.dialogService.open(EmployeesShowDialogContainerComponent, {
      data: { employeeId },
      closable: true,
    });
  }

  backPage(): void {
    if (this.employeesCompanyEmployeeListFacade?.getData()) {
      this.location.back();
    } else {
      this.router.navigate(['', 'employees']).then();
    }
  }
}
