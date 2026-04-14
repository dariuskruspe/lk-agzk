import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
    selector: 'fpc-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
    standalone: false
})
export class MessagesComponent {
  @Input() hint: string;

  errors: ValidationErrors;

  // errorKey -> errorMessage
  errorMessageMap: { [key: string]: string } = {};

  @Input() controlName: string;

  error: any;
  errorKey: string;
  errorMessage: string = '';

  initErrors(errorData: any = {}): void {
    if (!errorData || typeof errorData !== 'object') return;

    for (const key in errorData) {
      if (!this.hasOwnProperty(key)) continue;
      this[key] = errorData[key];
    }
  }

  clearErrors(): void {
    this.errorMessageMap = {};
    this.errorKey = null;
    this.errorMessage = '';
    this.error = null;
  }
}
