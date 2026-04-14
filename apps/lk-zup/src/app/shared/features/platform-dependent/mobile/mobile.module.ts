import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MobileInitializerComponent } from './mobile-initializer.component';

const routes: Route[] = [
  {
    path: '',
    component: MobileInitializerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileRouterModule {}

@NgModule({
  declarations: [MobileInitializerComponent],
  imports: [CommonModule, MobileRouterModule],
})
export class MobileModule {}
