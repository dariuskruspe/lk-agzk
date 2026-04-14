import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { AppSelectButtonService } from '../app-select-button.service';

@Component({
  selector: 'app-select-button-option',
  imports: [],
  templateUrl: './app-select-button-option.component.html',
  styleUrl: './app-select-button-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSelectButtonOptionComponent {
  appSelectButtonService = inject(AppSelectButtonService);

  value = input<unknown>();
}
