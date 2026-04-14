import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { MessageSnackbarService } from '../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../shared/features/message-snackbar/models/message-type.enum';
import { UserProfileSettingsService } from '../services/user-profile-settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileSettingsState {
  public entityName = 'profSettings';

  public geRxMethods: GeRxMethods = {
    add: {
      main: this.userSettingsService.addSettings.bind(this.userSettingsService),
      success: this.saveSettingsSuccess,
    },
  };

  constructor(
    private userSettingsService: UserProfileSettingsService,
    private messageSnackbarService: MessageSnackbarService
  ) {}

  saveSettingsSuccess(): Observable<void> {
    return of(
      this.messageSnackbarService.show(
        'Настройки успешно сохранены',
        MessageType.success
      )
    );
  }
}
