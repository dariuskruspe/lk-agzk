import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarGraphEmployeeNameCellData } from '../types';

@Component({
  selector: 'app-calendar-graph-employee-name-cell',
  imports: [CheckboxModule, FormsModule, TooltipModule],
  templateUrl: './calendar-graph-employee-name-cell.html',
  styleUrl: './calendar-graph-employee-name-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGraphEmployeeNameCellComponent {
  data = input.required<CalendarGraphEmployeeNameCellData>();
  selectionEnabled = input(false);
  selectedIds = input<string[]>([]);
  selectionValue = input<string | null>(null);
  checkboxName = input('selected-calendar-graph-items');
  checkboxStyleClass = input('calendar-graph-employee-name-cell__checkbox');

  cellClick = output<void>();
  selectionChange = output<string[]>();

  tooltip = computed(() => {
    const data = this.data();
    const parts: string[] = [];

    if (data.fullName) {
      parts.push(data.fullName);
    }
    if (data.position) {
      parts.push(data.position);
    }
    if (data.departmentName) {
      parts.push(data.departmentName);
    }

    return parts.join('\n');
  });

  onCellClick(): void {
    if (this.data().clickable === false) {
      return;
    }

    this.cellClick.emit();
  }

  onSelectionChange(ids: string[]): void {
    this.selectionChange.emit(ids);
  }
}
