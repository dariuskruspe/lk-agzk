import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { LangModule } from '@shared/features/lang/lang.module';

@Component({
    selector: 'app-crypto-pro-cert-select',
    templateUrl: './crypto-pro-cert-select.component.html',
    styleUrl: './crypto-pro-cert-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, LangModule]
})
export class CryptoProCertSelectComponent {
  certificates = input.required<CryptoProCert[]>();

  value = input<string>();

  valueChange = output<string>();

  onSelect(cert: CryptoProCert) {
    this.valueChange.emit(cert.thumbprint);
  }
}
