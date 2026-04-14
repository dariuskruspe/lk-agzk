import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthLoginService } from '../../services/auth-login.service';

@Component({
    selector: 'app-auth-factor2-code',
    templateUrl: './auth-factor2-code.component.html',
    styleUrls: ['./auth-factor2-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthFactor2CodeComponent implements OnInit {
  form: FormGroup;

  @Input() loading$;

  @Output() submitForm = new EventEmitter();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authApi: AuthLoginService
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `./assets/img/svg/sprite.svg`
      )
    );
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.authApi.showErrors(this.form);
    }
  }
}
