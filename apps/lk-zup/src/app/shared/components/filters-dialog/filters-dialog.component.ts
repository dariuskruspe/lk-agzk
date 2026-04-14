import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from "primeng/button";
import { LangModule } from "@shared/features/lang/lang.module";

@Component({
    selector: 'app-filters-dialog',
    imports: [CommonModule, ButtonDirective, LangModule],
    templateUrl: './filters-dialog.component.html',
    styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  @Output() closeButtonClicked: EventEmitter<any> = new EventEmitter();

  onClose(): void {
    this.closeButtonClicked.emit();
  }
}
