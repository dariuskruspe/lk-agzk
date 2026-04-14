import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { BackgroundComponent } from './components/background/background.component';
import { CardComponent } from './components/card/card.component';
import { TargetComponent } from './components/target/target.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    InputMaskModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
  ],
  declarations: [
    SafeHtmlPipe,
    CardComponent,
    TargetComponent,
    BackgroundComponent,
  ],
})
export class OnboardingModule {}
