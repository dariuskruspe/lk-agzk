import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactsInterface } from '../../models/contact.interface';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ContactComponent {
  @Output() formSubmitted = new EventEmitter<ContactsInterface>();

  @Input() loading: boolean;

  public formGroup: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { validators: [Validators.required] }),
  });

  public hasError = false;

  private comment =
    'Данный запрос был отправлен из мобильного приложения EmplDocs';

  constructor() {}

  submitForm(): void {
    this.formGroup.markAsTouched();
    this.formGroup.markAsDirty();
    if (this.formGroup.valid) {
      this.formSubmitted.emit({
        ...(this.formGroup.value as ContactsInterface),
        comment: this.comment,
        type: 0,
      });
    }
  }
}
