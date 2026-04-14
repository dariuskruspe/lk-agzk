import { Injectable } from '@angular/core';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmployeesCompaniesFacade } from '../../features/employees/facades/employees-companies.facade';
import { EmployeesCompaniesInterface } from '../../features/employees/models/employees-company.interface';
import { SettingsFacade } from '../features/settings/facades/settings.facade';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsFilterService {
  private isCompanies = false;

  constructor(
    private settings: SettingsFacade,
    private employeeCompaniesFacade: EmployeesCompaniesFacade
  ) {
    this.settings.forcedData$.pipe(take(1)).subscribe((result) => {
      this.isCompanies = result.employees.enableOrganizationFilter;
      if (this.isCompanies) {
        this.employeeCompaniesFacade.getCompanies();
      }
    });
  }

  setColClass(withCompanies: string[], withoutCompanies: string[]): string[] {
    return this.isCompanies ? withCompanies : withoutCompanies;
  }

  getOrganizationFilter({
    formControlName = 'organizationID',
    label,
    classesWithoutCompanies,
    classesWithCompanies,
  }: {
    formControlName: string;
    label: string;
    classesWithCompanies: string[];
    classesWithoutCompanies: string[];
  }): FpcInputsInterface | undefined {
    let input;
    if (this.isCompanies) {
      input = {
        type: 'select',
        formControlName,
        label,
        gridClasses: [
          ...this.setColClass(classesWithCompanies, classesWithoutCompanies),
          'com-md-12',
        ],
        validations: [],
        edited: true,
        optionList: [],
      };
    }
    return input;
  }

  get isShowOrganizationFilter(): boolean {
    return this.isCompanies;
  }

  get organizationList$(): Observable<EmployeesCompaniesInterface> {
    return this.employeeCompaniesFacade.forcedData$;
  }
}
