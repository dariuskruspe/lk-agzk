import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollableDirective } from './scrollable.directive';

@NgModule({
  declarations: [ScrollableDirective],
  exports: [ScrollableDirective],
  imports: [CommonModule],
})
export class ScrollableModule {}
