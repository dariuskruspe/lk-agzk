import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';
import { MessagesComponent } from '../components/form-messages/messages.component';
import {
  ValidatorMessages,
  ValidatorValueKeys,
} from '../dictionaries/validator-messages.dictionary';
import { LangFacade } from '../features/lang/facades/lang.facade';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[formField]',
    standalone: false
})
export class FormFieldDirective implements OnChanges, OnDestroy {
  @Input() formField: FormGroup;

  @Input() hint: string;

  @Input() formControlName: string;

  private messagesRef: ComponentRef<MessagesComponent>;

  private statusSub: SubscriptionLike;

  constructor(
    private cfr: ComponentFactoryResolver,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private lang: LangFacade
  ) {
    const messagesFactory = this.cfr.resolveComponentFactory(MessagesComponent);
    this.messagesRef = this.vcr.createComponent(messagesFactory);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.formField?.currentValue &&
      changes.formControlName?.currentValue
    ) {
      const control = this.formField.get(this.formControlName);
      this.handleStatus(control);
      this.messagesRef.instance.controlName = this.formControlName;
      this.messagesRef.instance.hint = this.hint ?? '';
    }
  }

  ngOnDestroy(): void {
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

  private handleStatus(control: AbstractControl): void {
    if (!this.statusSub) {
      this.statusSub = control?.statusChanges.subscribe((status) => {
        if (status === 'INVALID' && control.errors && !control.pristine) {
          const errorValues = {};
          this.messagesRef.instance.errors = [
            ...Object.keys(control.errors)
              .map((error) => {
                const message =
                  ValidatorMessages[error] ??
                  (typeof control.errors[error] === 'string'
                    ? control.errors[error]
                    : null);
                if (message) {
                  errorValues[message] =
                    this.getValue(control.errors?.[error]) ?? '';
                }
                return message;
              })
              .filter((item) => item),
          ];
          this.messagesRef.instance.errorValues = errorValues;
        } else {
          this.messagesRef.instance.errors = [];
        }
        this.cdr.detectChanges();
      });
    }
  }

  private getValue(value: unknown): string[] | null {
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const neededKey = keys.find((key) => ValidatorValueKeys[key]);
      const errorValue = value?.[neededKey];
      return errorValue
        ? ValidatorValueKeys[neededKey](errorValue, this.lang.getLang())
        : null;
    }
    return null;
  }
}
