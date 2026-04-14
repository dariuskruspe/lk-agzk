import { Component, Input } from '@angular/core';
import { MainCurrentUserFacade } from '../../../../../features/main/facades/main-current-user.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';
import { SuccessDataInterface } from '../../models/success-window.interface';

@Component({
    selector: 'app-success-window',
    templateUrl: './success-window.component.html',
    styleUrls: ['./success-window.component.scss'],
    standalone: false
})
export class SuccessWindowComponent {
  @Input() responseData: SuccessDataInterface;

  constructor(
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade
  ) {}
}
