import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpcMainComponent } from './components/fpc-main/fpc-main.component';
import {
  FpcBaseFilesComponent
} from './components/fpc-components/fpc-files/fpc-files.component';
import { TranslatePipe } from './pipes/lang.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BaseComponent } from './components/fpc-components/base-component/base.component';
import { MaskDirective } from './directives/mask.directive';
import { VacationValidateService } from './classes/custom-validator/services/vacation-validate.service';
import { ValidatorsUtils } from './utils/validators.utils';
import {
  FpcBaseShowFileDialogComponent
} from './components/fpc-components/fpc-show-file-dialog/fpc-show-file-dialog.component';
import { DateMaskDirective } from "./directives/date-mask.directive";

@NgModule({
  declarations: [
    FpcMainComponent,
    FpcBaseFilesComponent,
    TranslatePipe,
    TimeFormatPipe,
    BaseComponent,
    MaskDirective,
    DateMaskDirective,
    FpcBaseShowFileDialogComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    VacationValidateService,
    ValidatorsUtils
  ],
  exports: [
    FpcMainComponent,
    FpcBaseFilesComponent,
    MaskDirective,
    DateMaskDirective,
    TranslatePipe,
    TimeFormatPipe,
    FpcBaseShowFileDialogComponent,
  ],
})
export class BaseFormModule {}
