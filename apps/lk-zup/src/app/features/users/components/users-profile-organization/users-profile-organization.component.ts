import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import moment from 'moment';
import { EmployeesInterface } from '../../../employees/models/employees.interface';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';

@Component({
    selector: 'app-users-profile-organization',
    templateUrl: './users-profile-organization.component.html',
    styleUrls: ['./users-profile-organization.component.scss'],
    standalone: false
})
export class UsersProfileOrganizationComponent implements OnChanges {
  apiUrl = Environment.inv().api;

  @Input() personalData: EmployeesInterface;

  @Input() settings: SettingsInterface;

  @Output() editDialog = new EventEmitter();

  @Output() downloadFileArch = new EventEmitter<string>();

  items = [];

  constructor(
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade,
    public langFacade: LangFacade,
  ) {}

  setInfo(): void {
    this.items = [
      {
        title: 'COMPANY_NAME',
        value: this.personalData?.organizationShortName || 'NOT_FILLED',
      },
      {
        title: 'COMPANY_SUBDIVISION',
        value: this.personalData?.division || 'NOT_FILLED',
      },
      {
        title: 'COMPANY_EMPLOYMENT_DATE',
        value:
          moment(this.personalData?.employmentDate).format(
            this.langUtils
              .convert(this.langFacade.getLang(), 'DATE_PIPE')
              .split('dd')
              .join('DD'),
          ) || 'NOT_FILLED',
      },
    ];
  }

  ngOnChanges(): void {
    if (this.personalData) {
      this.setInfo();
      if (this.settings.userProfile.showSalary) {
        this.items.push({
          title: 'COMPANY_SALARY',
          value: `${this.personalData?.salary} ₽` || 'NOT_FILLED',
        });
      }
    }
  }

  downloadArch(fileId: string): void {
    this.downloadFileArch.emit(fileId);
  }
}
