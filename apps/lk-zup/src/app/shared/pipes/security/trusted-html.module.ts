import { NgModule } from '@angular/core';
import { TrustedHtmlPipe } from './trusted-html.pipe';

@NgModule({
  declarations: [TrustedHtmlPipe],
  exports: [TrustedHtmlPipe],
})
export class TrustedHtmlModule {}
