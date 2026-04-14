import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { LiquidDesignService } from '../shared/liquid-design.service';

@Component({
  selector: 'app-liquid-provider',
  imports: [],
  templateUrl: './liquid-provider.component.html',
  styleUrl: './liquid-provider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LiquidProviderComponent {
  liquidDesignService = inject(LiquidDesignService);

  ngOnInit() {}
}
