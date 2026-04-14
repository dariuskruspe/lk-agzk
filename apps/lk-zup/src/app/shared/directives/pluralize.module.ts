import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PluralizeDirective } from './pluralize.directive';

@NgModule({
  declarations: [PluralizeDirective],
  imports: [CommonModule],
  exports: [PluralizeDirective],
})
export class PluralizeModule {}
