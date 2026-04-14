import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
    standalone: false
})
export class MessagesComponent {
  @Input() hint: string;

  @Input() set errors(value: string[]) {
    this.error = value ? value[0] : '';
    const errorValue = this.errorValues?.[this.error];
    this.values = Array.isArray(errorValue) ? errorValue : [];
  }

  @Input() controlName: string;

  @Input() errorValues: { [key: string]: Array<string | number> };

  error = '';

  values = [];
}
