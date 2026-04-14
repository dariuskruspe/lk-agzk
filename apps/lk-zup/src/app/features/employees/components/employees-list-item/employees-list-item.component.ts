import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import { EmployeesCompanyEmployeeListInterface } from '../../models/employees-company-employee-list.interface';
import {
  EmployeeStateListInterface,
  EmployeeStateListItemInterface,
} from '../../models/employees.interface';

@Component({
    selector: 'app-employees-list-item',
    templateUrl: './employees-list-item.component.html',
    styleUrls: ['./employees-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EmployeesListItemComponent {
  apiUrl = Environment.inv().api;

  @Input() dataList: EmployeesCompanyEmployeeListInterface;

  @Input() otherData: {
    employeesStates: EmployeeStateListInterface;
  };

  @Output() clickItem = new EventEmitter();

  public dataConfig: ItemListBuilderInterface[] = [
    {
      type: 'avatar',
      name: 'photo',
      class: ['w-sm-20', 'align-sm-left'],
    },
    {
      type: 'heading',
      name: 'fullName',
      class: ['w-30', 'w-sm-80', 'align-sm-left'],
    },
    {
      type: 'spacer',
      class: ['w-sm-20', 'align-sm-left'],
    },
    {
      type: 'text',
      class: ['w-25', 'w-sm-80', 'align-sm-left'],
      name: 'position',
    },
    {
      type: 'spacer',
      class: ['w-sm-20', 'align-sm-left'],
    },
    {
      type: 'status',
      name: 'name',
      stateEnds: 'stateEnds',
      class: ['w-25', 'w-sm-80', 'align-right', 'align-sm-left'],
      color: '#989aa2',
      textTransform: 'capitalize',
      tooltip: true,
    },
  ];

  onClick(id: string): void {
    this.clickItem.emit(id);
  }

  findWorkStatus(status: number): EmployeeStateListItemInterface {
    return this.otherData?.employeesStates?.employeesStates.find(
      (e) => e.code === status
    );
  }
}
