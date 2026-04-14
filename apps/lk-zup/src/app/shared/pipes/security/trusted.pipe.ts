import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';
import { SecurityContextType } from '@shared/types/security/security-context-type.type';

/**
 * Помечаем переданную HTML-строку как безопасную (наивно доверяем HTML), чтобы Angular не блокировал его использование.
 *
 * !!!ACHTUNG!!! Может представлять опасность без дополнительных проверок, если "вслепую" доверять переданному HTML.
 */

/**
 * Помечаем переданное значение как безопасное в заданном контексте безопасности (наивно доверяем значению), чтобы
 * Angular не блокировал его использование.
 *
 * Оригинал (SafePipe): https://github.com/embarq/safe-pipe/blob/master/projects/safe-pipe/src/lib/safe-pipe.pipe.ts
 */
@Pipe({
  name: 'trusted',
  standalone: true,
})
export class TrustedPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(
    value: string,
    securityContextType: SecurityContextType
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (securityContextType) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(
          `TrustedPipe unable to bypass security for invalid type: ${securityContextType}`
        );
    }
  }
}
