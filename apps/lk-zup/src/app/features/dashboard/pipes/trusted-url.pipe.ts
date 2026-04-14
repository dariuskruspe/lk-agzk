import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Помечаем URL ресурса как безопасный (наивно доверяем URL-у ресурса), чтобы Angular не блокировал его использование.
 *
 * !!!ACHTUNG!!! Может представлять опасность без дополнительных проверок, если "вслепую" доверять переданному URL.
 */
@Pipe({
    name: 'trustedUrl',
    standalone: false
})
export class TrustedUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
