import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrPresentationBridgeContainerComponent } from './containers/hr-presentation-bridge-container/hr-presentation-bridge-container.component';

const routes: Routes = [
  { path: '', component: HrPresentationBridgeContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrPresentationRoutingModule {}
