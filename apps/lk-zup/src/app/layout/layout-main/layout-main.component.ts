import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainModule } from '@app/features/main/main.module';

// старый шаблон, в будущем будет полностью заменен на layout-main-v2
@Component({
  selector: 'app-layout-main',
  imports: [MainModule],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMainComponent {}
