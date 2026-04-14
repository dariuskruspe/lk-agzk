import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
} from '@angular/core';
import { FormControlName } from '@angular/forms';
import { BehaviorSubject, map, Subscription } from 'rxjs';

@Component({
    selector: 'app-form-field',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'field app-field',
    },
    standalone: false
})
export class FormFieldComponent implements OnInit {
  showError = new BehaviorSubject(false);
  showError$ = this.showError.asObservable();

  errors$ = this.showError.pipe(map(() => this.formControlRef?.errors));

  subscription?: Subscription;

  @ContentChild(FormControlName) formControlRef?: FormControlName;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.subscription = this.formControlRef?.statusChanges?.subscribe(
      (data) => {
        this.showError.next(data === 'INVALID');
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
