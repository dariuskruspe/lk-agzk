import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerModule } from 'primeng/spinner';

import { HrPresentationBridgeContainerComponent } from './containers/hr-presentation-bridge-container/hr-presentation-bridge-container.component';
import { HrPresentationRoutingModule } from './hr-presentation-routing.module';

@NgModule({
  declarations: [HrPresentationBridgeContainerComponent],
  imports: [
    CommonModule,
    HrPresentationRoutingModule,
    SpinnerModule,
    ProgressSpinnerModule,
    CardModule,
  ],
})
export class HrPresentationModule {}
