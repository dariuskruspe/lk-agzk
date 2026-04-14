import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { UsersProfileDownloadArchFacade } from '@features/users/facades/users-profile-download-arch.facade';
import { ItemListInterface } from '@shared/components/item-list/models/item-list.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { SuccessWindowContainerComponent } from '../../../../shared/features/success-window/containers/success-window-container/success-window-container.component';
import { Preloader } from '../../../../shared/services/preloader.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { UsersProfilePersonalDataFacade } from '../../facades/users-profile-personal-data.facade';
import { UserProfileIssuesDialogContainerComponent } from '../user-profile-issues-dialog-container/user-profile-issues-dialog-container.component';

@Component({
    selector: 'app-user-profile-info-container',
    templateUrl: './user-profile-info-container.component.html',
    styleUrls: ['./user-profile-info-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('CONTACT_INFO', 0)],
    standalone: false
})
export class UserProfileInfoContainerComponent
  implements OnInit, AfterViewInit
{
  constructor(
    public usersProfilePersonalDataFacade: UsersProfilePersonalDataFacade,
    public usersProfileDownloadArchFacade: UsersProfileDownloadArchFacade,
    readonly settingsFacade: SettingsFacade,
    private preloader: Preloader,
    public dialogService: DialogService,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(this.usersProfilePersonalDataFacade.loading$());
  }

  ngAfterViewInit(): void {
    this.usersProfilePersonalDataFacade.getPersonalData();
  }

  openIssueDialog(name: string, index?: number): void {
    const dialogRef = this.dialogService.open(
      UserProfileIssuesDialogContainerComponent,
      {
        width: '1065px',
        data: { alias: name, relativeIndex: index + 1 },
        closable: true,
        dismissableMask: true,
      }
    );

    dialogRef.onClose.subscribe((result) => {
      if (result && result.success) {
        this.dialogService.open(SuccessWindowContainerComponent, {
          width: '1065px',
          data: result,
          closable: true,
          dismissableMask: true,
        });
      }
    });
  }

  openOneIssueDialog(value: { alias: string; item: ItemListInterface }) {
    this.openIssueDialog(value.alias, value.item.index);
  }

  downloadArch(fileId: string): void {
    this.usersProfileDownloadArchFacade.show(fileId);
  }
}
