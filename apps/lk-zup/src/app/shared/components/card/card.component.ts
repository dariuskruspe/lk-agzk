import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { Preloader, providePreloader } from '../../services/preloader.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [providePreloader(ProgressSpinner)],
    standalone: false
})
export class CardComponent {
  @Input() withPaddings = true;

  @Input() set loading(value: Observable<boolean> | Observable<boolean>[]) {
    const arrayfiedValue: Observable<boolean>[] = Array.isArray(value)
      ? value
      : [value];
    this.preloader.setCondition(...arrayfiedValue);
  }

  @Input() additionalStyles = '';

  constructor(private preloader: Preloader) {}
}
