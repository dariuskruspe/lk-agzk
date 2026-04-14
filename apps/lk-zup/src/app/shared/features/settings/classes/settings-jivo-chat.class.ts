import { Injectable } from '@angular/core';
import {
  SettingsJivositeContactInfoInterface,
  SettingsJivositeCustomDataInterface,
} from '../models/settings-jivosite.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsJivoChatClass {
  jivoChatClass = 'jivo-chat';

  installChat(channel: string | 'auth' | 'others'): HTMLScriptElement {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('async', 'async');
    scriptEl.setAttribute(
      'src',
      `//code-ya.jivosite.com/widget/${this.getChatChannel(channel)}`
    );
    scriptEl.classList.add(this.jivoChatClass);
    document.head.appendChild(scriptEl);
    return scriptEl;
  }

  unInstallChat(): void {
    const existingLinkElement = this.getExistingScriptElementByKey();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jivoDestroy = window.jivo_destroy;
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
    if (jivoDestroy) {
      const elements = document.querySelectorAll('jdiv');
      jivoDestroy();
      if (elements?.length) {
        elements.forEach((el) => {
          el?.parentNode?.removeChild(el);
        });
      }
    }
  }

  setContactCustomInfo(
    contact: SettingsJivositeContactInfoInterface,
    customData: SettingsJivositeCustomDataInterface[]
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jivoApi = window.jivo_api;
    const jivoInterval = setInterval(() => {
      if (jivoApi) {
        jivoApi.setContactInfo(contact);
        jivoApi.setCustomData(customData);
        clearInterval(jivoInterval);
      }
    }, 200);
  }

  getExistingScriptElementByKey(): Element {
    return document.head.querySelector(
      `script[async="async"].${this.jivoChatClass}`
    );
  }

  getChatChannel(name: string): string {
    switch (name) {
      case 'auth':
        return 'WUEmxs9Asu';
      case 'others':
        return 'WzncnVU7u6';
      default:
        return '';
    }
  }
}
