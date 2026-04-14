import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackInterface } from '@features/feedback/models/feedback.interface';

@Component({
    selector: 'app-feedback-form',
    templateUrl: './feedback-form.component.html',
    styleUrls: ['./feedback-form.component.scss'],
    standalone: false
})
export class FeedbackFormComponent implements OnInit {
  @Output() submitFeedback = new EventEmitter<FeedbackInterface>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    const group: any = {
      name: ['', [Validators.required]],
    };
    this.form = this.fb.group(group);
  }

  onSubmit() {
    this.markAsTouched(this.form);
    if (this.form.valid) {
      this.submitFeedback.emit(this.form.value);
    }
  }

  markAsTouched(group: FormGroup): void {
    const controls = Array.isArray(group.controls)
      ? group.controls
      : Object.values(group.controls);
    for (const control of controls) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
