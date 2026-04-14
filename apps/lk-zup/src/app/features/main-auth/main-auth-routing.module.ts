import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAuthTemplateContainerComponent } from './containers/main-auth-template-container/main-auth-template-container.component';

const routes: Routes = [
  {
    path: '',
    component: MainAuthTemplateContainerComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainAuthRoutingModule {}
