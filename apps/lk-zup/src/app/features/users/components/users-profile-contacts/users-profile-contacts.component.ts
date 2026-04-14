import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import { EmployeesInterface } from '../../../employees/models/employees.interface';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';

@Component({
    selector: 'app-users-profile-contacts',
    templateUrl: './users-profile-contacts.component.html',
    styleUrls: ['./users-profile-contacts.component.scss'],
    standalone: false
})
export class UsersProfileContactsComponent {
  apiUrl = Environment.inv().api;

  @Input() personalData: EmployeesInterface;

  @Input() settings: SettingsInterface;

  @Output() editDialog = new EventEmitter();

  constructor(public currentUserFacade: MainCurrentUserFacade) {}

  onEditContacts(): void {
    this.editDialog.emit('contacts');
  }
}
