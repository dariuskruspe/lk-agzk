import { Injectable } from '@angular/core';
import { SettingsJivoChatClass } from '../classes/settings-jivo-chat.class';

@Injectable({
  providedIn: 'root',
})
export class SettingsJivositeFacade {
  constructor(private settingsJivoChatClass: SettingsJivoChatClass) {}

  installScript(channel: string): void {
    this.settingsJivoChatClass.installChat(channel);
  }

  uninstallScript(): void {
    this.settingsJivoChatClass.unInstallChat();
  }

  setContactCustomInfo(): void {
    this.settingsJivoChatClass.setContactCustomInfo(
      {
        name: '',
        email: '',
      },
      [
        {
          key: 'userID',
          title: 'userID',
          content: '',
        },
        {
          key: 'employeeID',
          title: 'employeeID',
          content: '',
        },
        {
          key: 'fullName',
          title: 'Имя пользователя',
          content: '',
        },
        {
          key: 'email',
          title: 'email',
          content: '',
        },
      ]
    );
  }
}
