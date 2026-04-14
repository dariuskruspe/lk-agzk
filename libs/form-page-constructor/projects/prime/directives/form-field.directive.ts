import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  UntypedFormGroup,
} from '@angular/forms';
import { delay, SubscriptionLike } from 'rxjs';
import { FpcInputsInterface } from '../../base/models/fpc.interface';
import { MessagesComponent } from '../components/messages/messages.component';
import { ValidatorMessages } from '../constants/validator-messages.dictionary';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[formField]',
    standalone: false
})
export class FormFieldDirective implements OnChanges, OnDestroy {
  @Input() form: UntypedFormGroup;

  @Input() item: FpcInputsInterface;

  private messagesRef: ComponentRef<MessagesComponent>;

  private statusSub: SubscriptionLike | undefined;

  constructor(
    private controlContainer: ControlContainer,
    private vcr: ViewContainerRef,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.messagesRef = this.vcr.createComponent(MessagesComponent);
    this.statusSub = undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['item']?.currentValue &&
      changes['form']?.currentValue &&
      this.form.get(this.item.formControlName)
    ) {
      const control = this.form.get(this.item.formControlName);
      this.handleStatus(control);
      if (this.item.formControlName) {
        this.messagesRef.instance.controlName = this.item.formControlName;
      }
      if (this.item.hintMessage) {
        this.messagesRef.instance.hint = this.item.hintMessage;
      }

      const setHidden = (value: boolean, changeTemplateClass?: boolean) => {
        if (changeTemplateClass) {
          const customFormFieldElement = this.el.nativeElement.parentNode;
          if (value) {
            // скрываем элемент (добавляем класс 'hidden')
            if (!this.item.gridClasses?.includes('hidden')) {
              this.item.gridClasses = [...this.item.gridClasses, 'hidden'];
            }

            this.renderer.addClass(customFormFieldElement, 'hidden');
            this.renderer.setStyle(customFormFieldElement, 'display', 'none');
            this.renderer.setStyle(
              customFormFieldElement,
              'visibility',
              'hidden',
            );
          } else {
            // показываем элемент (удаляем класс 'hidden')
            this.item.gridClasses = this.item.gridClasses?.filter(
              (v) => v !== 'hidden',
            );

            this.renderer.removeClass(customFormFieldElement, 'hidden');
            this.renderer.setStyle(customFormFieldElement, 'display', 'block');
            this.renderer.setStyle(
              customFormFieldElement,
              'visibility',
              'visible',
            );
          }
          if (!control) return;
          (control as any).hidden = Boolean(value);
        } else {
          this.renderer.setStyle(
            this.el.nativeElement.closest('.custom-form-field'),
            'display',
            value ? 'none' : 'block',
          );
          this.renderer.setStyle(
            this.el.nativeElement.closest('.custom-form-field'),
            'visibility',
            value ? 'hidden' : 'visible',
          );
          if (!control) return;
          (control as any).hidden = Boolean(value);
        }
      };
      // @ts-ignore
      control._el = this.el.nativeElement.closest('.custom-form-field');
      // @ts-ignore
      control.setHidden = setHidden.bind(this);
    }
  }

  ngOnDestroy(): void {
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

  private handleStatus(control: AbstractControl | null): void {
    if (!this.statusSub) {
      this.statusSub = control.statusChanges.subscribe((status) => {
        if (status === 'INVALID' && control.errors && control.dirty) {
          this.initErrorMessages(control);
        } else {
          this.clearErrorMessages();
        }
      });
    }
  }

  initErrorMessages(control: AbstractControl): void {
    const errorMessageMap = this.getErrorMessageMap(control);
    const errorKey: string = Object.keys(errorMessageMap)?.[0];
    const errorMessage: string =
      (Object.values(errorMessageMap)?.[0] as string) || '';
    const error: any = control.errors[errorKey];
    const errors: any = control.errors;

    this.messagesRef.instance.initErrors({
      error,
      errorKey,
      errorMessage,
      errors,
      errorMessageMap,
    });
  }

  clearErrorMessages(): void {
    this.messagesRef.instance.clearErrors();
  }

  getErrorMessageMap(control: AbstractControl): { [key: string]: string } {
    // errorKey -> errorMessage
    const errorMessageMap: { [key: string]: string } = {};

    for (const [errorKey, v] of Object.entries(control.errors)) {
      const errorMessageFromFpcField = this.item.errorMessages?.[errorKey];

      const validatorMessageFromDictionary = ValidatorMessages[errorKey];

      const errorMessageFromControl =
        typeof control.errors[errorKey] === 'string'
          ? control.errors[errorKey]
          : null;

      const errorMessage: string =
        errorMessageFromFpcField ??
        validatorMessageFromDictionary ??
        errorMessageFromControl;

      errorMessageMap[errorKey] = errorMessage ?? '';
    }

    return errorMessageMap;
  }
}
