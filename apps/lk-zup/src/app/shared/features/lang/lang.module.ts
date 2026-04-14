import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipes/lang.pipe';
import { TranslateObjPipe } from './pipes/traslate-obj.pipe';

@NgModule({
  exports: [TranslatePipe, TranslateObjPipe],
  declarations: [TranslatePipe, TranslateObjPipe],
})
export class LangModule {}
