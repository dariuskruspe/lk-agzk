import {
  ApplicationRef,
  Inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogManagerService } from './dialog-manager.service';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService extends DialogService {
  constructor(
    appRef: ApplicationRef,
    injector: Injector,
    @Inject('DIALOG_MANAGER')
    private manager: DialogManagerService,
  ) {
    super(appRef, injector, document);
  }

  open(
    componentType: Type<any>,
    config: DynamicDialogConfig,
  ): DynamicDialogRef {
    if (!config.breakpoints) {
      config.breakpoints = { '1199px': '75vw', '575px': '95vw' };
    }

    const ref = super.open(componentType, {
      baseZIndex: 1000,
      appendTo: 'body',
      ...config,
      maximizable: true,
    });
    this.manager.add(ref);
    return ref;
  }
}
