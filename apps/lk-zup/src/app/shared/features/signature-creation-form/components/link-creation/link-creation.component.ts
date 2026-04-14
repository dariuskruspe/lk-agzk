import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractCreationComponent } from '../abstract-creation/abstract-creation.component';

@Component({
    selector: 'app-link-creation',
    templateUrl: './link-creation.component.html',
    styleUrls: ['./link-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LinkCreationComponent extends AbstractCreationComponent {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  handleSubmit(): void {
    this.goLink();
    this.close();
  }
}
