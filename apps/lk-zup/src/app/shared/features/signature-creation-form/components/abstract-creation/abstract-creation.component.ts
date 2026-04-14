import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SignatureResponseInterface } from '../../../../models/signature-response.interface';
import { SignatureProviderInterface } from '../../../signature-validation-form/models/providers.interface';
import { SignatureValidationFormInterfaces } from '../../../signature-validation-form/models/signature-validation-form.interfaces';

@Component({
    template: '',
    standalone: false
})
export class AbstractCreationComponent implements OnDestroy {
  @Input() provider: SignatureProviderInterface;

  @Input() submit$: Subject<{ signInfo: SignatureValidationFormInterfaces }>;

  @Input() response: SignatureResponseInterface;

  @Output() onclose = new EventEmitter<void>();

  loading = new BehaviorSubject<boolean>(false);

  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(
    data: { signInfo: SignatureValidationFormInterfaces } = {
      signInfo: { provider: this.provider?.metadata?.id },
    }
  ): void {
    this.loading.next(true);
    this.submit$.next(data);
    this.submit$.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.loading.next(false);
    });
  }

  close(): void {
    this.onclose.next();
  }

  goLink(): void {
    window.open(this.response?.link ?? '', '_blank');
  }

  onChanged(): void {}
}
