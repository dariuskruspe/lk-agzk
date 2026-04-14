import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
    selector: 'app-insurance-custom-accordion',
    templateUrl: './insurance-custom-accordion.component.html',
    styleUrls: ['./insurance-custom-accordion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InsuranceCustomAccordionComponent {
  @Input() title: string;

  @Input() count: number = 0;

  @Input() isOpen: boolean = false;

  @Output() changeCount = new EventEmitter<number>();

  change(): void {
    this.changeCount.emit(this.count);
  }
}
