import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EvaluationListItemInterface} from "@features/career/shared/types";

@Component({
    selector: 'app-evaluation-list',
    imports: [
        CommonModule,
    ],
    templateUrl: './evaluation-list.component.html',
    styleUrl: './evaluation-list.component.scss',
    providers: []
})
export class EvaluationListComponent {
  @Input() items: EvaluationListItemInterface[] = [];
  @Output() clickItem: EventEmitter<string> = new EventEmitter();

  toEvaluationClick(id: string): void {
    this.clickItem.emit(id);
  }

  isStateDone(stateName: string): 'done' | 'pending' {
    return stateName.toLowerCase() === 'выполнено' ? 'done': 'pending'
  }
}
