import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
  selector: 'fpc-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  standalone: false,
})
export class TimepickerComponent extends BaseComponent implements OnInit {
  timeValue: Date | null = null;

  ngOnInit(): void {
    const formValue = this.form?.get(this.item?.formControlName)?.value;
    if (formValue && typeof formValue === 'string') {
      this.timeValue = this.parseTimeString(formValue);
    }
  }

  timeBinding(formControlName: string, value: Date | null): void {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      this.form.patchValue({ [formControlName]: '' });
      return;
    }

    const hours = value.getHours().toString().padStart(2, '0');
    const minutes = value.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    this.form.patchValue({ [formControlName]: timeString });
  }

  private parseTimeString(timeString: string): Date | null {
    if (!timeString) {
      return null;
    }

    const parts = timeString.split(':');
    if (parts.length !== 2) {
      return null;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
