import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
    selector: 'app-support-version-info-menu',
    templateUrl: './support-version-info-menu.component.html',
    styleUrls: ['./support-version-info-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SupportVersionInfoMenuComponent {
  Object = Object;

  @Input() changeLogFile: unknown;

  @Output() version = new EventEmitter();

  getVersion(version: string): void {
    this.version.emit(version);
  }
}
