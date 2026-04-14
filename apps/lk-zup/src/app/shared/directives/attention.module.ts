import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AttentionDirective } from './attention.directive';

@NgModule({
  declarations: [AttentionDirective],
  exports: [AttentionDirective],
  imports: [CommonModule],
})
export class AttentionModule {}
