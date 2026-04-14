import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DesktopInitializerComponent } from './desktop-initializer.component';

const routes: Route[] = [
  {
    path: '',
    component: DesktopInitializerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesktopRouterModule {}

@NgModule({
  declarations: [DesktopInitializerComponent],
  imports: [CommonModule, DesktopRouterModule],
})
export class DesktopModule {}
