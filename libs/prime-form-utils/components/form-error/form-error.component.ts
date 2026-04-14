import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { of } from 'rxjs';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
    selector: 'app-form-error',
    templateUrl: './form-error.component.html',
    styleUrls: ['./form-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FormErrorComponent implements OnInit {
  shown$ = of(false);

  constructor(
    @Inject(FormFieldComponent) private formFieldRef: FormFieldComponent,
  ) {
    this.shown$ = this.formFieldRef.showError$;
  }

  ngOnInit(): void {}
}
