import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { AbstractConfirmationActionComponent } from '../abstract-action/abstract-action.component';

@Component({
    selector: 'app-confirmation-code',
    templateUrl: './confirmation-code.component.html',
    styleUrls: ['./confirmation-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ConfirmationCodeComponent extends AbstractConfirmationActionComponent {
  code: number | null = null;

  hasError = false;

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    event.stopPropagation();
    this.confirm();
  }

  confirm(): void {
    if (!this.code) {
      this.hasError = true;
      return;
    }
    this.confirmAction({ code: this.code.toString(), cancel: false });
    this.hasError = false;
  }

  onModelChanged(): void {
    this.hasError = !this.code;
  }
}
