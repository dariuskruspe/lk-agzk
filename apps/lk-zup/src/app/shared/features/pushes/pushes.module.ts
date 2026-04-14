import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PushWebAdapter } from './adapters/push-web.adapter';
import { PushesAllowHintDialogComponent } from './components/pushes-allow-hint-dialog/pushes-allow-hint-dialog.component';
import { PushesEnableDialogComponent } from './components/pushes-enable-dialog/pushes-enable-dialog.component';
import { PushesIconComponent } from './components/pushes-icon/pushes-icon.component';
import { PushSettingsService } from './services/push-settings.service';
import { PushesService } from './services/pushes.service';

@NgModule({
  declarations: [
    PushesEnableDialogComponent,
    PushesAllowHintDialogComponent,
    PushesIconComponent,
  ],
  imports: [CommonModule, DynamicDialogModule, ButtonModule],
  providers: [PushesService, PushWebAdapter, PushSettingsService],
})
export class PushesModule {}
