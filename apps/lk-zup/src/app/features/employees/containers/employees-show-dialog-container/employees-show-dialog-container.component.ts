import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeesCompanyProfileDialogFacade } from '../../facades/employees-company-profile-dialog.facade';
import { EmployeesStateListFacade } from '../../facades/employees-state-list.facade';

@Component({
    selector: 'app-employees-show-dialog-container',
    templateUrl: './employees-show-dialog-container.component.html',
    styleUrls: ['./employees-show-dialog-container.component.scss'],
    standalone: false
})
export class EmployeesShowDialogContainerComponent implements OnInit {
  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public employeeStateListFacade: EmployeesStateListFacade,
    public employeesCompanyProfileDialogFacade: EmployeesCompanyProfileDialogFacade
  ) {}

  ngOnInit(): void {
    this.employeesCompanyProfileDialogFacade.getEmployeeProfile(
      this.config.data.employeeId
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
