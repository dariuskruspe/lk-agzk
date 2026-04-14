import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssuesEmailApprovalFacade } from '@features/issues-approval/facades/issues-email-approval.facade';
import { IssuesService } from '@features/issues/services/issues.service';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { logError } from '@shared/utilits/logger';
import { firstValueFrom, Subscription } from 'rxjs';
import { IssuesEmailApprovalQueryInterface } from '../../models/issues-email-approval.interface';

@Component({
  selector: 'app-issues-email-approval-container',
  templateUrl: './issues-email-approval-container.component.html',
  styleUrls: ['./issues-email-approval-container.component.scss'],
  standalone: false,
})
export class IssuesEmailApprovalContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  queryParams: IssuesEmailApprovalQueryInterface;

  convertedParams: {
    fromEmail: boolean;
    taskId: string;
    approverId: string;
    issueId: string;
    approve: boolean;
    needAuthorization: boolean;
    lang: 'en' | 'ru';
    taskType: string;
    employeeId: string;
    year: number | null;
    comment?: string;
    periods?: string;
  };

  settings: SettingsInterface;

  isTaskApproved: boolean = false;

  loading: WritableSignal<boolean> = signal(false);

  isApprove: boolean | null = null;

  loadings: any = {
    issueEmailApprove: false,
    isTaskApproved: false,
  };

  subscription: Subscription = new Subscription();

  error = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private issuesService: IssuesService,
    public settingsFacade: SettingsFacade,
    public issuesEmailApprovalFacade: IssuesEmailApprovalFacade,
    private localstorageService: LocalStorageService,
    private langFacade: LangFacade,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.addSubscriptions();
  }

  ngAfterViewInit(): void {
    this.queryParams = {
      ...(this.activatedRoute.snapshot
        .queryParams as IssuesEmailApprovalQueryInterface),
    };
    this.initApproval();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private addSubscriptions(): void {
    this.subscription.add(
      this.issuesEmailApprovalFacade.forcedLoading$.subscribe(
        (loading: boolean) => {
          this.loadings.issueEmailApprove = loading;
          this.loadingHandler(loading);
        },
      ),
    );
  }

  loadingHandler(loading: boolean): void {
    if (loading) this.loading.set(true);
    else {
      // отменяем лоадер только в том случае, если нет других активных загрузок
      if (!Object.values(this.loadings).some((l: boolean) => l === true)) {
        this.loading.set(false);
      }
    }
  }

  private async initApproval(): Promise<void> {
    const params: IssuesEmailApprovalQueryInterface = this.queryParams;
    this.isApprove = params.approve === 'true';
    this.convertedParams = {
      fromEmail: params.fromEmail === 'true',
      taskId: params.taskId,
      approverId: params.approverId,
      issueId: params.issueId ?? '',
      approve: params.approve === 'true',
      needAuthorization: params.needAuthorization === 'true',
      lang: params.lang === 'ru' || params.lang === 'en' ? params.lang : 'ru',
      taskType: params.taskType ?? 'issue',
      employeeId: params.employeeId ?? '',
      year: params.year ? +params.year : null,
    };

    if (params.periods) {
      this.convertedParams.periods = params.periods;
    }

    this.langFacade.setLang(this.convertedParams.lang);
    const accessToken = this.localstorageService.getTokens();
    this.isTaskApproved = await this.checkIfTaskApproved();
    if (this.convertedParams.needAuthorization && !accessToken) {
      this.issuesEmailApprovalFacade.show(this.convertedParams);
    } else {
      if (this.convertedParams.fromEmail && !this.isTaskApproved) {
        this.issueApprovalResultHandler();
      }
    }
  }

  /**
   * Выполняем проверку была ли задача по заявке согласована ранее.
   * @param taskId uuid задачи по согласованию
   */
  async checkIfTaskApproved(
    taskId: string = this.convertedParams.taskId,
  ): Promise<boolean> {
    let response;
    let success: boolean = true;

    this.loadings.isTaskApproved = true;
    this.loadingHandler(true);
    try {
      response = await firstValueFrom(
        this.issuesService.isTaskApproved(taskId),
      );
    } catch (err) {
      success = false;
      this.error = true;
      this.ref.detectChanges();
      logError(err);
    } finally {
      this.loadings.isTaskApproved = false;
      this.loadingHandler(false);
    }

    if (!success) return;
    if (response?.taskApproved)
      this.issuesEmailApprovalFacade.edit(this.convertedParams);

    return !!response?.taskApproved;
  }

  /**
   * Обработчик события 'approve', содержащего данные из дочернего компонента при нажатии кнопки "Согласовать".
   * @param e событие 'approve' (содержит поле 'comment' с комментарием пользователя о согласовании заявки)
   */
  onApprove(e: any): void {
    this.convertedParams.approve = true;
    this.convertedParams.comment = e.comment;
    this.issueApprovalResultHandler();
  }

  /**
   * Обработчик события 'reject', содержащего данные из дочернего компонента при нажатии кнопки "Отклонить".
   * @param e событие 'reject' (содержит поле 'comment' с комментарием пользователя об отклонении заявки)
   */
  onReject(e: any): void {
    this.convertedParams.approve = false;
    this.convertedParams.comment = e.comment;
    this.issueApprovalResultHandler();
  }

  /**
   * Обработчик результата согласования (нажатия на кнопку "Согласовать"/"Отклонить") заявки руководителем.
   */
  issueApprovalResultHandler(): void {
    if (this.isTaskApproved !== undefined) {
      this.issuesEmailApprovalFacade.edit(this.convertedParams);
    }
  }
}
