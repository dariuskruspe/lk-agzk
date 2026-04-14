import {
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormFieldComponent } from '../components/form-field/form-field.component';

@Directive({
    selector: '[appFormErrors]',
    standalone: false
})
export class FormErrorsDirective implements OnInit, OnDestroy {
  private isViewCreated = false;
  private readonly context = new FormErrorsContext();

  private subscription?: Subscription;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<FormErrorsContext>,
    @Inject(FormFieldComponent) private formFieldRef: FormFieldComponent
  ) {}

  ngOnInit() {
    if (!this.isViewCreated) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
      this.isViewCreated = true;
    }

    this.subscription = this.formFieldRef.errors$.subscribe((errors) => {
      this.context.$implicit = errors || {};
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  static ngTemplateContextGuard(
    directive: FormErrorsDirective,
    context: unknown
  ): context is FormErrorsContext {
    console.log('guard', directive, context);
    return true;
  }
}

class FormErrorsContext {
  $implicit: ValidationErrors = {};
}
