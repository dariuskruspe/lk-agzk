import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { SuccessWindowContainerComponent } from '../../../../shared/features/success-window/containers/success-window-container/success-window-container.component';
import { providePreloader } from '../../../../shared/services/preloader.service';
import { UserProfileIssuesDialogContainerComponent } from '../user-profile-issues-dialog-container/user-profile-issues-dialog-container.component';

@Component({
    selector: 'app-users-profile-container',
    templateUrl: './users-profile-container.component.html',
    styleUrls: ['./users-profile-container.component.scss'],
    providers: [providePreloader(ProgressBar)],
    standalone: false
})
export class UsersProfileContainerComponent {
  magicLinkView: boolean;

  constructor(public dialogService: DialogService) {}

  openIssueDialog(name: string): void {
    const dialogRef = this.dialogService.open(
      UserProfileIssuesDialogContainerComponent,
      {
        width: '1065px',
        data: name,
        closable: true,
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
}
