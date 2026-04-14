import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ItemListInterface } from '@shared/components/item-list/models/item-list.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import {
  EmployeeDataRelativesInterface,
  EmployeesInterface,
} from '../../../employees/models/employees.interface';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { AppService } from "@shared/services/app.service";
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';

@Component({
    selector: 'app-users-profile-personal-data',
    templateUrl: './users-profile-personal-data.component.html',
    styleUrls: ['./users-profile-personal-data.component.scss'],
    standalone: false
})
export class UsersProfilePersonalDataComponent {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  @Input() personalData: EmployeesInterface;

  @Input() personalDataRelatives: EmployeeDataRelativesInterface;

  @Input() settings: SettingsInterface;

  @Output() editDialog = new EventEmitter();

  @Output() editOneDialog = new EventEmitter<{
    alias: string;
    item: ItemListInterface;
  }>();

  constructor(
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade,
    public langFacade: LangFacade,
    private datePipe: DatePipe
  ) {}

  onPersonalDataEdit(alias: string): void {
    this.editDialog.emit(alias);
  }

  isSimpleView(): boolean {
    return this.settings?.userProfile?.relativesType === 'simple';
  }

  get relatives(): ItemListInterface[] | undefined {
    return this.personalData?.relatives?.length
      ? this.personalData?.relatives?.map((relative) => ({
          title: '',
          value: relative.fullName || 'NOT_FILLED',
          items: [
            {
              title: 'STATIC_DATA_RELATION_DEGREE',
              value: relative.relation || 'NOT_FILLED',
            },
            {
              title: 'STATIC_DATA_DATE_OF_BIRTH',
              value:
                this.datePipe.transform(
                  relative.dateOfBirth,
                  this.langUtils.convert(this.langFacade.getLang(), 'DATE_PIPE')
                ) || 'NOT_FILLED',
            },
            ...relative.addInfo
              .filter((info) => info.addInfoValue)
              .map((info) => ({
                title: info.addInfoName,
                value: info.addInfoValue,
              })),
          ],
        })) ?? [{ title: 'NOT_FILLED' }]
      : [{ title: 'NOT_FILLED' }];
  }

  editOne(item: ItemListInterface): void {
    this.editOneDialog.emit({ alias: 'relatives', item });
  }

  sectionSettings(): { relatives?: { enable: boolean } } {
    const userSettings: UserSettingsInterface = this.app.userSettingsSignal();
    return {
      relatives: (userSettings as any)?.relatives as { enable: boolean } | undefined,
    };
  }
}
