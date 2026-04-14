import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';
import { FpcInputsInterface } from '../../../base/models/fpc.interface';

@Component({
    selector: 'fpc-arr-smart-show-mode',
    templateUrl: './arr-smart-show-mode.component.html',
    styleUrls: ['./arr-smart-show-mode.component.scss'],
    standalone: false
})
export class ArrSmartShowModeComponent extends BaseComponent {
  @Input() fileOpeningInProcess: boolean;

  @Output() getFile = new EventEmitter<string>();

  @Input() aliasesMatch: any[];

  openFile(id: string): void {
    this.getFile.emit(id);
  }

  getAlias(control: FpcInputsInterface, index: number): string {
    if (this.aliasesMatch && this.aliasesMatch.length && this.aliasesMatch[index]) {
      return this.aliasesMatch[index][control.formControlName] || control?.optionListRequestAlias;
    }
    return control?.optionListRequestAlias;
  }

  getOption(control: FpcInputsInterface, index: number) {
    const alias = this.getAlias(control, index);
    return this.optionList && this.optionList[alias]
      ? this.optionList[alias].optionList
      : control.optionList;
  }
}
