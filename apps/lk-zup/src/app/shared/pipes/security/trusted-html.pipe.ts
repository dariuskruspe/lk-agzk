import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { marked } from 'marked';

/**
 * Помечаем переданную HTML-строку как безопасную (наивно доверяем HTML), чтобы Angular не блокировал его использование.
 *
 * !!!ACHTUNG!!! Может представлять опасность без дополнительных проверок, если "вслепую" доверять переданному HTML.
 */
@Pipe({
    name: 'trustedHtml',
    standalone: false
})
export class TrustedHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string, isMarkdown: boolean = false): SafeHtml {
    return isMarkdown
      ? this.sanitized.bypassSecurityTrustHtml(
          marked.parse(value.toString(), { async: false }),
        )
      : this.sanitized.bypassSecurityTrustHtml(value);
  }
}
