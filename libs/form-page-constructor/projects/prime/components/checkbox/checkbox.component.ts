import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../base/components/fpc-components/base-component/base.component';

@Component({
    selector: 'fpc-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    standalone: false
})
export class CheckboxComponent extends BaseComponent {

  @Input() index: number;

}
