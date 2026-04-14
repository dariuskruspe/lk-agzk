import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-app-updater-modal',
    imports: [CommonModule, ButtonModule, DynamicDialogModule, LangModule],
    templateUrl: './app-updater-modal.component.html',
    styleUrls: ['./app-updater-modal.component.scss'],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppUpdaterModalComponent {
  private ref = inject(DynamicDialogRef);

  apply() {
    this.ref.close(true);
  }

  cancel() {
    this.ref.close(false);
  }
}
