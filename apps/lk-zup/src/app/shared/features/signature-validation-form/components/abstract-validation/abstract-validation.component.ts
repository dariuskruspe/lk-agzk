import { Component, OnDestroy } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SignatureResponseInterface } from '../../../../models/signature-response.interface';
import { SignatureProviderInterface } from '../../models/providers.interface';
import { SignatureValidationFormInterfaces } from '../../models/signature-validation-form.interfaces';

@Component({
    template: '',
    standalone: false
})
export class AbstractValidationComponent implements OnDestroy {
  response: SignatureResponseInterface;

  provider: SignatureProviderInterface;

  submit$: Subject<{ signInfo: SignatureValidationFormInterfaces }>;

  loading = new BehaviorSubject<boolean>(false);

  forEmployee: boolean;

  signatureEnable: boolean;

  protected destroy$ = new Subject<void>();

  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    this.response = this.config?.data.response;
    this.provider = this.config?.data.provider;
    this.submit$ = this.config?.data.submit$;
    this.forEmployee = this.config?.data.forEmployee ?? true;
    this.signatureEnable = this.config?.data.signatureEnable ?? false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  confirm(
    data: { signInfo: SignatureValidationFormInterfaces } = {
      signInfo: { provider: this.provider.metadata?.id },
    }
  ): void {
    this.loading.next(true);
    this.submit$.next(data);
    this.submit$.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.loading.next(false);
    });
  }

  close(): void {
    this.dialogRef.close(false);
    this.dialogRef.close(false);
    this.submit$?.next(undefined);
  }

  goLink(): void {
    window.open(this.response?.link || '', '_blank');
  }

  needToCreateSignature(): void {}
}
