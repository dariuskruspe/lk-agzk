import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LangModule } from '@shared/features/lang/lang.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomPageRoutingModule } from './custom-page-routing.module';
import { CustomPageContainerComponent } from './containers/custom-page-container/custom-page-container.component';
import { SupportModule } from '../support/support.module';
import { CustomSectionsTemplateViewComponent } from '@app/shared/features/custom-sections/custom-sections-template-view/custom-sections-template-view.component';
import { CardModule } from 'primeng/card';
@NgModule({
  declarations: [CustomPageContainerComponent],
  imports: [
    CommonModule,
    CustomPageRoutingModule,
    ProgressBarModule,
    LangModule,
    FormsModule,
    ToolbarModule,
    SupportModule,
    CardModule,
    CustomSectionsTemplateViewComponent,
  ],
})
export class CustomPageModule {}
