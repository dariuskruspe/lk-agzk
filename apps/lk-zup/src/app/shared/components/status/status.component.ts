import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangModule } from '@shared/features/lang/lang.module';

const SEVERITY_CLASSES = {
  success: ['rgba(241, 248, 212, 1)'],
  warning: ['rgba(255, 233, 200, 1)'],
  info: ['#c3d9ff'],
  error: ['#fed6d6'],
  default: ['#dedede'],
};

const DEFAULT_TEXT_COLOR = 'rgba(37, 47, 63, 1)';

@Component({
    selector: 'app-status',
    imports: [CommonModule, LangModule],
    templateUrl: './status.component.html',
    styleUrl: './status.component.scss'
})
export class StatusComponent {
  title = input.required<string>();

  severity = input<'info' | 'error' | 'warning' | 'success' | 'default'>(
    'default',
  );

  customBackground = input<string>('');

  customColor = input<string>('');

  style = computed(() => {
    const [severityBg, severityColor] = SEVERITY_CLASSES[this.severity()]!;
    return {
      'background-color': this.customBackground() || severityBg,
      color: this.customColor() || severityColor || DEFAULT_TEXT_COLOR,
    };
  });
}
