import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-liquid-input',
  imports: [],
  templateUrl: './liquid-input.component.html',
  styleUrl: './liquid-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidInputComponent {
  width = signal(584);
  height = signal(56);
}
