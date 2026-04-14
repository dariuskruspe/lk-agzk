import { Injectable } from '@angular/core';
import { ThemeDataAttrValue, ThemeStylesheetId } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsThemeClass {
  stylesheetClass = 'theme';

  setStyle(key: ThemeStylesheetId): void {
    this.getLinkElementForKey().setAttribute('href', `${key}.css`);
  }

  removeStyle(): void {
    const existingLinkElement = this.getExistingLinkElementByKey();
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  setMobileAttr(): void {
    document.body.setAttribute('data-platform', 'mobile');
  }

  private getLinkElementForKey(): Element {
    return (
      this.getExistingLinkElementByKey() || this.createLinkElementWithKey()
    );
  }

  setThemeDataAttr(theme: ThemeDataAttrValue): void {
    document.body.setAttribute('data-theme', theme);
  }

  private getExistingLinkElementByKey(): HTMLLinkElement | null {
    return document.head.querySelector(
      `link[rel="stylesheet"].${this.stylesheetClass}`,
    );
  }

  private createLinkElementWithKey(): HTMLLinkElement {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.stylesheetClass);
    document.head.appendChild(linkEl);
    return linkEl;
  }
}
