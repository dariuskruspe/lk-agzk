import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { MessageSnackbarService } from '../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../shared/features/message-snackbar/models/message-type.enum';
import { UsersProfilePasswordService } from '../services/users-profile-password.service';

@Injectable({
  providedIn: 'root',
})
export class UsersProfilePasswordState {
  public entityName = 'setPass';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.usersProfilePasswordService.changePass.bind(
        this.usersProfilePasswordService
      ),
      success: this.changePassSuccess,
    },
  };

  constructor(
    private usersProfilePasswordService: UsersProfilePasswordService,
    private messageSnackbarService: MessageSnackbarService
  ) {}

  changePassSuccess(): Observable<void> {
    return of(
      this.messageSnackbarService.show('Пароль изменен', MessageType.info)
    );
  }
}
