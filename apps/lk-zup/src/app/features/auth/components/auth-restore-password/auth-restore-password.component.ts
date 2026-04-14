import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-auth-restore-password',
    templateUrl: './auth-restore-password.component.html',
    styleUrls: ['./auth-restore-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthRestorePasswordComponent implements OnInit, OnChanges {
  passwordForm: FormGroup;

  @Input() loading;

  @Input() status;

  @Output() submitPasswordForm = new EventEmitter();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`
      )
    );
  }

  ngOnChanges(): void {
    if (this.passwordForm && this.loading !== null) {
      if (this.loading) {
        this.passwordForm.disable();
      } else {
        this.passwordForm.enable();
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.submitPasswordForm.emit(this.passwordForm.value);
    }
  }
}
