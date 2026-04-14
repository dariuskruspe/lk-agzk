import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { EmployeePersonalDataInterface } from '../../models/employees-personal-data.interface';
import {
  EmployeeStateListInterface,
  EmployeeStateListItemInterface,
} from '../../models/employees.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';

@Component({
    selector: 'app-employees-show',
    templateUrl: './employees-show.component.html',
    styleUrls: ['./employees-show.component.scss'],
    standalone: false
})
export class EmployeesShowComponent implements OnInit, OnChanges {
  apiUrl = Environment.inv().api;

  @Input() employeePersonalData: EmployeePersonalDataInterface;

  @Input() employeeStateList: EmployeeStateListInterface;

  @Input() synonymsSettings:  UserSettingsInterface;

  @Input() dialogMode: boolean;

  @Output() backPage = new EventEmitter<void>();

  @Output() goRouteManager = new EventEmitter<string>();

  synonym: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.employeePersonalData = data?.employee;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.synonymsSettings?.currentValue) {
      const synonymObject = this.synonymsSettings.employees.synonyms?.find(syn => syn['approver']);
      if (synonymObject) {
        this.synonym = synonymObject['approver'];
      }
    }
  }

  findWorkStatus(status: number): EmployeeStateListItemInterface {
    return this.employeeStateList?.employeesStates.find(
      (e) => e.code === status
    );
  }

  onBackPage(): void {
    this.backPage.emit();
  }

  onGoRouteManager(employeeId: string): void {
    this.goRouteManager.emit(employeeId);
  }
}
