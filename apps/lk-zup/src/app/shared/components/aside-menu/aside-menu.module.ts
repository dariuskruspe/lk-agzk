import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AppSkeletonModule } from '../../directives/app-skeleton.module';
import { AsideMenuComponent } from './aside-menu.component';

@NgModule({
  exports: [AsideMenuComponent],
  declarations: [AsideMenuComponent],
  imports: [CommonModule, PanelMenuModule, AppSkeletonModule],
})
export class AsideMenuModule {}
