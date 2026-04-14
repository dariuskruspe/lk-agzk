import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  Optional,
} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SignableFacade } from '../../../classes/abstractions/signable.facade';
import { SignatureResponseInterface } from '../../../models/signature-response.interface';
import { ERROR } from '../constants/error';
import { SignatureValidationContainerComponent } from '../containers/signature-validation-form-container/signature-validation-form-container.component';
import { SignatureInfoContainerInterface } from '../models/signature-info.interface';

@Injectable()
export class SignatureValidationService {
  private componentRef: ComponentRef<SignatureValidationContainerComponent> | null =
    null;

  constructor(
    private app: ApplicationRef,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private dialogRef: DynamicDialogRef,
  ) {}

  confirmAndSign(value: {
    data: SignatureInfoContainerInterface;
    facade: SignableFacade<unknown>;
    body?: any;
    signatureEnabled?: boolean;
  }): Observable<SignatureResponseInterface | typeof ERROR> {
    if (!this.componentRef) {
      const factory = this.cfr.resolveComponentFactory(
        SignatureValidationContainerComponent,
      );
      this.componentRef = factory.create(this.injector);
      this.app.attachView(this.componentRef.hostView);
      this.componentRef.instance.facade = value.facade;
      this.componentRef.instance.providersInfo = value.data.providers;
      this.componentRef.instance.signatureEnable =
        value.signatureEnabled ?? true;
      this.componentRef.instance.fileInfo = {
        fileID: value.data.fileID,
        fileOwner: value.data.fileOwner,
        file64: value.data.file64,
      };
      this.componentRef.instance.body = { ...value.body, ...value.data };

      return this.componentRef.instance.validate.pipe(
        take(1),
        tap(() => {
          this.app.detachView(this.componentRef.hostView);
          this.componentRef.destroy();
          this.componentRef = null;
        }),
      );
    }
    return of();
  }
}
