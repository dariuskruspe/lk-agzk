import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
    selector: 'app-support-onboarding',
    templateUrl: './support-onboarding.component.html',
    styleUrls: ['./support-onboarding.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SupportOnboardingComponent {
  @Input() loading: boolean;

  @Output() repeat = new EventEmitter<string>();

  repeatOnboarding(name: string): void {
    this.repeat.emit(name);
  }
}
