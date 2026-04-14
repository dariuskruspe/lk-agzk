import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { MessageSnackbarService } from '../../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../../shared/features/message-snackbar/models/message-type.enum';
import { CryptoService } from '../../../../shared/services/crypto.service';

@Component({
    selector: 'app-user-profile-magic-link',
    templateUrl: './user-profile-magic-link.component.html',
    styleUrls: ['./user-profile-magic-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserProfileMagicLinkComponent implements OnInit {
  magicLinkType: 'login' | 'token' = 'token';

  cryptoStr: string;

  icon = 'assets/img/ed-bg.png';

  magicLink = '';

  @Input() token: string;

  @Input() set customIcon(v: string) {
    if (v) {
      this.icon = `${Environment.inv().api}${v}`;
    }
  }

  constructor(
    private messageSnackbarService: MessageSnackbarService,
    private cryptoService: CryptoService
  ) {
    (window as any).encryptAuth = (login: string, pass: string): string => {
      return this.cryptoService.encrypt({
        type: 'login',
        login,
        pass,
      });
    };
  }

  ngOnInit(): void {
    switch (this.magicLinkType) {
      case 'login':
        this.cryptoStr = this.cryptoService.encrypt({
          type: 'login',
          login: '',
          pass: '',
        });
        break;
      case 'token':
        this.cryptoStr = this.cryptoService.encrypt({
          type: 'token',
          token: this.token,
        });
        break;
      default:
        break;
    }
    let origin = Environment.isMobileApp()
      ? Environment.inv().api
      : window.location.origin;
    origin = origin.endsWith('/') ? origin : `${origin}/`;
    const baseHref = Environment.inv().baseHref?.endsWith('/')
      ? Environment.inv().baseHref
      : `${Environment.inv().baseHref}/`;
    this.magicLink = `${origin}${baseHref}auth/ml?t=${this.cryptoStr}`;
  }

  copyLink(el: Element): void {
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    this.messageSnackbarService.show(
      'Ссылка скопирована в буфер обмена',
      MessageType.success
    );
  }
}
