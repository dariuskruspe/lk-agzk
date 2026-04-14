import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TimesheetLegendItem } from './timesheet-legend.interface';
import { AppIconComponent } from "@app/shared/components/app-icon/app-icon.component";

@Component({
  selector: 'app-timesheet-legend',
  imports: [LucideAngularModule, AppIconComponent],
  templateUrl: './timesheet-legend.html',
  styleUrl: './timesheet-legend.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetLegend {
  items = input.required<TimesheetLegendItem[]>();
}
