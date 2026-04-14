import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AsyncBreadcrumbInterface } from '../../../shared/models/async-breadcrumb.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { MainCurrentUserFacade } from '../../main/facades/main-current-user.facade';
import {
  IssuesInterface,
  IssuesJoinInterface,
} from '../models/issues.interface';
import { IssuesState } from '../states/issues.state';

@Injectable({
  providedIn: 'root',
})
export class IssuesFacade
  extends AbstractFacade<IssuesJoinInterface>
  implements AsyncBreadcrumbInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: IssuesState,
    protected localstorageService: LocalStorageService,
    protected currentUserFacade: MainCurrentUserFacade
  ) {
    super(geRx, store);
  }

  addIssue(params: IssuesInterface): void {
    const employeeID = this.localstorageService.getCurrentEmployeeId();
    const { userID } = this.currentUserFacade.getData();
    return this.add({ ...params, employeeID, userID });
  }

  getLabel$(): Observable<string> {
    return this.getData$().pipe(map((v) => v?.issueType?.FullName));
  }

  showIssue(issueID: string): void {
    this.geRx.show(this.store.entityName, issueID);
  }

  editIssue(body: {
    IssueID: string;
    viewed?: boolean;
    state?: string;
    taskId?: string;
  }): void {
    this.geRx.edit(this.store.entityName, body);
  }

  setDialogToClose(dialog: DynamicDialogRef): void {
    this.store.dialog = dialog;
  }
}
