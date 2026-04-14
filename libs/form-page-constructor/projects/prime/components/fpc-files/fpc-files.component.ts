import {
  Component, Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { FpcBaseFilesComponent } from '../../../base/components/fpc-components/fpc-files/fpc-files.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'fpc-files',
    templateUrl: './fpc-files.component.html',
    styleUrls: ['./fpc-files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class FpcFilesComponent extends FpcBaseFilesComponent {
  isError = false;

  onError() {
    this.isError = true;
  }

  constructor(
    @Inject('apiToken') @Optional() public readonly apiUrl: string,
    @Inject('fileIconsPath') @Optional() public readonly iconPath: string
  ) {
    super(apiUrl, iconPath);
  }
}
