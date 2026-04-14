import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CalendarGraphCellVariant } from '../types';

export type CalendarGraphLegendVariant = CalendarGraphCellVariant;

@Component({
  selector: 'app-calendar-graph-legend',
  imports: [NgClass],
  templateUrl: './calendar-graph-legend.html',
  styleUrl: './calendar-graph-legend.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGraphLegendComponent {
  name = input<string>();
  color = input<string>();
  variant = input<CalendarGraphLegendVariant>('default');
  icon = input<'sun' | 'plane'>('sun');
}
