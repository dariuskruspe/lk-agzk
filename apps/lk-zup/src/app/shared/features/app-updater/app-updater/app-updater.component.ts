import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppUpdaterModalComponent } from '@shared/features/app-updater/app-updater-modal/app-updater-modal.component';
import { NewVersionCheckerService } from '@shared/features/app-updater/shared/new-version-checker';
import { logDebug } from '@shared/utilits/logger';
import { DialogModule } from 'primeng/dialog';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
    selector: 'app-app-updater',
    imports: [CommonModule, DialogModule, DynamicDialogModule],
    providers: [DialogService],
    templateUrl: './app-updater.component.html',
    styleUrls: ['./app-updater.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppUpdaterComponent implements OnInit {
  private newVersionCheckerService = inject(NewVersionCheckerService);

  private dialogService = inject(DialogService);

  private destroyRef = inject(DestroyRef);

  private dialog: DynamicDialogRef;

  ngOnInit() {
    logDebug('AppUpdater started');
    this.newVersionCheckerService.checkForUpdate(60); // проверка каждые 60 секунд

    // For development purposes
    (window as any).n = this.newVersionCheckerService;

    this.newVersionCheckerService.isNewVersionAvailable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isNewVersionAvailable) => {
        if (isNewVersionAvailable) {
          this.showUpdateDialog();
        }
      });
  }

  showUpdateDialog() {
    if (this.dialog) {
      return;
    }
    this.dialog = this.dialogService.open(AppUpdaterModalComponent, {
      showHeader: false,
      width: '80%',
      closable: false,
      keepInViewport: true,
      style: {
        'max-width': '400px',
      },
      maskStyleClass: 'p-dialog-mask-lg',
    });

    this.dialog.onClose.subscribe((ok) => {
      this.dialog = null;

      if (ok) {
        this.newVersionCheckerService.applyUpdate();
      }
    });
  }
}
