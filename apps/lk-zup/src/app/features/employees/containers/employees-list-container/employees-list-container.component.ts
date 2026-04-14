import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { DepartmentsFilterService } from '../../../../shared/services/departments-filter.service';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { EmployeesCompanyDepartmentsFacade } from '../../facades/employees-company-departments.facade';
import { EmployeesCompanyEmployeeListFacade } from '../../facades/employees-company-employee-list.facade';
import { EmployeesStateFilterListFacade } from '../../facades/employees-state-filter-list.facade';
import { EmployeesStateListFacade } from '../../facades/employees-state-list.facade';
import { EmployeesCompanyEmployeeListFormFilter } from '../../models/employees-company-employee-list.interface';

@Component({
    selector: 'app-employees-list-container',
    templateUrl: './employees-list-container.component.html',
    styleUrls: ['./employees-list-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_COMPANY', 0),
    ],
    standalone: false
})
export class EmployeesListContainerComponent implements OnInit {
  chosenCompany = '';

  constructor(
    private router: Router,
    public employeesCompanyEmployeeListFacade: EmployeesCompanyEmployeeListFacade,
    public employeesCompanyDepartmentsFacade: EmployeesCompanyDepartmentsFacade,
    public employeeStateListFacade: EmployeesStateListFacade,
    public employeeStateFilterListFacade: EmployeesStateFilterListFacade,
    private preloader: Preloader,
    public departmentsFilterService: DepartmentsFilterService,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.employeesCompanyDepartmentsFacade.loading$(),
      this.employeesCompanyEmployeeListFacade.loading$()
    );

    this.employeesCompanyDepartmentsFacade.getDepartments();
    this.employeeStateFilterListFacade.getStateFilterList();
  }

  getEmployeeList(filterData?: EmployeesCompanyEmployeeListFormFilter): void {
    const modFilter = { ...filterData };
    this.chosenCompany = filterData.organizationID ?? '';
    if (
      !this.chosenCompany &&
      this.departmentsFilterService.isShowOrganizationFilter
    ) {
      modFilter.departments = [];
    }
    this.employeesCompanyEmployeeListFacade.getEmployeeList(modFilter);
  }

  onEmployeeDetails(employeeId: string): void {
    this.router.navigate(['', 'employees', employeeId]).then();
  }
}
