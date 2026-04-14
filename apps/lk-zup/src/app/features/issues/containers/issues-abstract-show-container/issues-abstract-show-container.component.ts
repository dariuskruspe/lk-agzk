import { Location } from '@angular/common';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { IssueApproveInterface } from '@features/issues-approval/models/issue-approve.interface';
import { IssueApproveService } from '@features/issues-approval/services/issue-approve.service';
import { IssuesArchFacade } from '@features/issues/facades/issues-arch.facade';
import { IssuesCancelFacade } from '@features/issues/facades/issues-cancel.facade';
import { IssuesDocsSignListFacade } from '@features/issues/facades/issues-docs-sign-list.facade';
import { IssuesFormFileFacade } from '@features/issues/facades/issues-form-file.facade';
import { IssuesHistoryFacade } from '@features/issues/facades/issues-history.facade';
import { IssuesListFacade } from '@features/issues/facades/issues-list.facade';
import { IssuesStatusListFacade } from '@features/issues/facades/issues-status-list.facade';
import { IssuesStatusStepsFacade } from '@features/issues/facades/issues-status-steps.facade';
import { IssuesFacade } from '@features/issues/facades/issues.facade';
import { IssuesDocSignInterface } from '@features/issues/models/issues-doc-sign.interface';
import { IssueCancelInterface } from '@features/issues/models/issues.interface';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { SignatureFileContainerComponent } from '@shared/features/signature-file/containers/signature-file-container/signature-file-container.component';
import { ERROR } from '@shared/features/signature-validation-form/constants/error';
import { combineLoadings } from '@shared/utilits/combine-loadings.utils';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest, firstValueFrom, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IssuesAbstractShowContainer {
  loading$!: Observable<boolean>;

  loadingSignal: WritableSignal<boolean> = signal(false);

  issueId: string;

  constructor(
    public myIssuesShowFacade: IssuesFacade,
    public myIssuesListFacade: IssuesListFacade,
    public issueHistoryFacade: IssuesHistoryFacade,
    private activatedRoute: ActivatedRoute,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public issuesStatusStepsFacade: IssuesStatusStepsFacade,
    public issuesFormFileFacade: IssuesFormFileFacade,
    public issuesDocsSignListFacade: IssuesDocsSignListFacade,
    public issuesArchFacade: IssuesArchFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
    private location: Location,
    public dialogService: DialogService,
    public issuesCancelFacade: IssuesCancelFacade,
    public settingsFacade: SettingsFacade,
    private issueApproveService: IssueApproveService,
  ) {
    this.loading$ = combineLoadings(
      this.myIssuesShowFacade.forcedLoading$,
      this.issuesStatusListFacade.forcedLoading$,
    );
    this.loading$.subscribe((value) => {
      this.loadingSignal.set(value);
    });
  }

  /**
   * Обновляем отображаемые на фронте данные, касающиеся текущей заявки или списка заявок.
   */
  updateApplicationData(): void {
    if (!this.issueId) {
      return;
    }

    this.myIssuesShowFacade.showIssue(this.issueId);
    this.issuesDocsSignListFacade.getDocSignList(this.issueId);
    this.issueHistoryFacade.showHistory(this.issueId);
    this.myIssuesListFacade.getList();
  }

  getFile(id: string): void {
    this.issuesFormFileFacade.getFileBase64(id);
  }

  docOnClick(doc: IssuesDocSignInterface): void {
    const modDoc = doc;
    modDoc.issueID = this.issueId;
    const dialog = this.dialogService.open(SignatureFileContainerComponent, {
      data: modDoc,
      width: '1065px',
      closable: true,
      dismissableMask: true,
      styleClass: 'show-document',
    });
    dialog.onClose.pipe(take(1)).subscribe((result) => {
      if (result && result !== ERROR) {
        this.updateApplicationData();
      }
    });
  }

  onDownloadArch(): void {
    this.issuesArchFacade.getIssuesArchAll(this.issueId);
  }

  onIssueCancel(data: IssueCancelInterface): void {
    const modData = { ...data };
    modData.issueID = this.issueId;
    this.issuesCancelFacade.issueCancel(modData);
  }

  get isRequiringApproval$(): Observable<boolean> {
    return combineLatest(
      this.issuesStatusListFacade.forcedData$,
      this.myIssuesShowFacade.forcedData$,
    ).pipe(
      map((result) => {
        return (
          !!result[0]?.states?.find((s) => {
            return s.id === result[1]?.issue?.state;
          })?.approve && result[1]?.issue?.taskID !== null
        );
      }),
    );
  }

  get isRequiringSignature$(): Observable<boolean> {
    return combineLatest(
      this.issuesDocsSignListFacade.forcedData$,
      this.myIssuesShowFacade.forcedData$,
      this.agreementDocumentStateFacade.forcedData$,
    ).pipe(
      map((result) => {
        const signatureEnabled = !!result[1]?.issue?.signatureEnable;
        const isRequiringSignDocs = !!result[0]?.find(
          (doc) => !!doc.currentRole,
        );
        return signatureEnabled && isRequiringSignDocs;
      }),
    );
  }

  async approveManually(isApproved: boolean, comment: string): Promise<any> {
    const issueData = this.myIssuesShowFacade.getData();
    const applicationData: IssueApproveInterface = {
      taskId: issueData.issue.taskID,
      approve: isApproved,
      comment,
    };

    return firstValueFrom(
      this.issueApproveService.approveApplication(applicationData),
    );
  }
}
