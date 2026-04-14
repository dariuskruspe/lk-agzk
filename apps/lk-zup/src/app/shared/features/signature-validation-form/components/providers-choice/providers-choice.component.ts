import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RememberSettingService } from '@shared/services/remember-setting.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SignatureProviderInterface } from '../../models/providers.interface';

@Component({
    selector: 'app-providers-choice',
    templateUrl: './providers-choice.component.html',
    styleUrls: ['./providers-choice.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ProvidersChoiceComponent {
  lastProviderSetting = inject(RememberSettingService).lastProvider;

  providers = signal<SignatureProviderInterface[]>([]);

  chosenProvider = signal<SignatureProviderInterface>(null);

  forEmployee = signal(false);

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {
    this.providers.set(config.data.providers);
    this.forEmployee.set(config.data?.forEmployee ?? true);

    let chosen = this.providers()[0];

    if (this.lastProviderSetting.get()) {
      const found = this.providers().find(
        (i) => i.metadata.id === this.lastProviderSetting.get()
      );
      if (found) {
        chosen = found;
      }
    }

    this.chosenProvider.set(chosen);
  }

  choose(): void {
    this.dialogRef.close(this.chosenProvider());
    this.lastProviderSetting.remember(this.chosenProvider().metadata.id);
  }

  close(): void {
    this.dialogRef.close();
  }
}
