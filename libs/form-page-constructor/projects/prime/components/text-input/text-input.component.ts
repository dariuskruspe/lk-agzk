import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
    selector: 'fpc-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
    standalone: false
})
export class TextInputComponent extends BaseComponent {}
