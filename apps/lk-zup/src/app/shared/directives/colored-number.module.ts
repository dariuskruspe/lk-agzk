import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColoredNumberDirective } from './colored-number.directive';

@NgModule({
  declarations: [ColoredNumberDirective],
  exports: [ColoredNumberDirective],
  imports: [CommonModule],
})
export class ColoredNumberModule {}
