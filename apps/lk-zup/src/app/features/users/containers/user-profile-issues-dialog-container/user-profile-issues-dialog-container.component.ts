import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { UserProfileIssuesFacade } from '../../facades/user-profile-issues.facade';
import { UsersProfilePersonalDataFacade } from '../../facades/users-profile-personal-data.facade';
import {
  UserProfileDialogActualAddressInterface,
  UserProfileDialogAddressInterface,
  UserProfileDialogCitizenshipInterface,
  UserProfileDialogContactsInterface,
  UserProfileDialogOtherInterface,
  UserProfileDialogPassportInterface,
  UserProfileDialogRegistrationAddressInterface,
} from '../../models/user-profile-dialog.interface';

@Component({
    selector: 'app-user-profile-issues-dialog-container',
    templateUrl: './user-profile-issues-dialog-container.component.html',
    styleUrls: ['./user-profile-issues-dialog-container.component.scss'],
    standalone: false
})
export class UserProfileIssuesDialogContainerComponent implements OnInit {
  submit$ = new Subject<void>();

  public alias: string;

  public relativeIndex: number;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public userProfileIssuesFacade: UserProfileIssuesFacade,
    public usersProfilePersonalDataFacade: UsersProfilePersonalDataFacade,
    public currentUserFacade: MainCurrentUserFacade,
    public langUtils: LangUtils
  ) {}

  ngOnInit(): void {
    this.alias = this.config.data.alias;
    this.relativeIndex = this.config.data.relativeIndex;
    this.userProfileIssuesFacade.showIssueType(this.alias);
  }

  onSubmitDialog(): void {
    this.submit$.next(null);
  }

  addIssue(
    value:
      | UserProfileDialogOtherInterface
      | UserProfileDialogContactsInterface
      | UserProfileDialogPassportInterface
      | UserProfileDialogAddressInterface
      | UserProfileDialogCitizenshipInterface
      | UserProfileDialogRegistrationAddressInterface
      | UserProfileDialogActualAddressInterface
  ): void {
    this.userProfileIssuesFacade.addIssuesDialog(value, this.dialogRef);
  }
}
