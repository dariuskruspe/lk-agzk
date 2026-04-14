import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
    selector: 'fpc-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    standalone: false
})
export class NumberInputComponent extends BaseComponent {}
