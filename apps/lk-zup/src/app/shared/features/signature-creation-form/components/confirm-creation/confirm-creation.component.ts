import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractCreationComponent } from '../abstract-creation/abstract-creation.component';

@Component({
    selector: 'app-confirm-creation',
    templateUrl: './confirm-creation.component.html',
    styleUrls: ['./confirm-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ConfirmCreationComponent extends AbstractCreationComponent {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
}
