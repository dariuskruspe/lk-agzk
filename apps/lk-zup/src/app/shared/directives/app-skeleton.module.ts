import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AppSkeletonDirective } from './skeleton.directive';

@NgModule({
  declarations: [AppSkeletonDirective],
  imports: [CommonModule, SkeletonModule],
  exports: [AppSkeletonDirective, SkeletonModule],
})
export class AppSkeletonModule {}
