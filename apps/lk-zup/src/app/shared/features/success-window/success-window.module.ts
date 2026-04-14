import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LangModule } from '../lang/lang.module';
import { AgreementsSuccessComponent } from './components/agreements-success-component/agreements-success.component';
import { SuccessWindowComponent } from './components/success-window-components/success-window.component';
import { SuccessWindowContainerComponent } from './containers/success-window-container/success-window-container.component';

@NgModule({
  declarations: [
    SuccessWindowComponent,
    SuccessWindowContainerComponent,
    AgreementsSuccessComponent,
  ],
  imports: [CommonModule, MatIconModule, LangModule],
  exports: [SuccessWindowContainerComponent],
})
export class SuccessWindowModule {}
