import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
    selector: 'fpc-password-input',
    templateUrl: './password-input.component.html',
    styleUrls: ['./password-input.component.scss'],
    standalone: false
})
export class PasswordInputComponent extends BaseComponent {}
