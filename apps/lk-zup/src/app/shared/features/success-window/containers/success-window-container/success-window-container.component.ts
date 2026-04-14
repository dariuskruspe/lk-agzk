import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MainCurrentUserFacade } from '../../../../../features/main/facades/main-current-user.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';

@Component({
    selector: 'app-success-window-container',
    templateUrl: './success-window-container.component.html',
    styleUrls: ['./success-window-container.component.scss'],
    standalone: false
})
export class SuccessWindowContainerComponent implements OnInit {
  public data: any;

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade
  ) {}

  ngOnInit(): void {
    this.data = this.config.data;
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
