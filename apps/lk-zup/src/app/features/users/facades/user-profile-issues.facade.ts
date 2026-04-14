import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { FormDataInterface } from '../../../shared/features/success-window/models/success-window.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { IssuesTypesTemplateInterface } from '../../issues/models/issues-types.interface';
import { MainCurrentUserFacade } from '../../main/facades/main-current-user.facade';
import { UsersProfileIssuesState } from '../states/users-profile-issues.state';

@Injectable({
  providedIn: 'root',
})
export class UserProfileIssuesFacade extends AbstractFacade<IssuesTypesTemplateInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: UsersProfileIssuesState,
    private localstorageService: LocalStorageService,
    private mainCurrentUserFacade: MainCurrentUserFacade
  ) {
    super(geRx, store);
  }

  showIssueType(alias: string): void {
    this.geRx.show(this.store.entityName, alias);
  }

  addIssuesDialog(
    issueBody: FormDataInterface,
    dialog: DynamicDialogRef
  ): void {
    // todo  удалить добавление параметров после реализации jwt
    const modIssueBody = issueBody;
    modIssueBody.employeeID = this.localstorageService.getCurrentEmployeeId();
    modIssueBody.userID = this.mainCurrentUserFacade.getData().userID;
    this.store.dialogImport = dialog;
    this.geRx.add(this.store.entityName, modIssueBody);
  }
}
