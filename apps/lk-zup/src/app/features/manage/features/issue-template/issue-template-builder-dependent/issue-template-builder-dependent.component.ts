import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-issue-template-builder-dependent',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    DividerModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    CheckboxModule,
    AccordionModule,
    RadioButtonModule,
  ],
  templateUrl: './issue-template-builder-dependent.component.html',
  styleUrl: './issue-template-builder-dependent.component.scss',
})
export class IssueTemplateBuilderDependentComponent {
  dependent: { control: string; condition: string; clone: boolean }[] = [];

  @Input() set dependentValue(
    value: { control: string; condition: string; clone: boolean }[],
  ) {
    if (value) {
      value = value.map((dep) => ({
        ...dep,
        clone: dep.clone || !dep.condition,
      }));
    }
    this.dependent = value || [];
  }

  @Output() changeDependent = new EventEmitter<
    { control: string; condition: string; clone: boolean }[]
  >();

  addDependent() {
    this.dependent.push({
      control: '',
      condition: '',
      clone: false,
    });
    this.changeDependent.emit(this.dependent);
  }

  removeDependent(index: number) {
    this.dependent.splice(index, 1);
    this.changeDependent.emit(this.dependent);
  }

  /**
   * Обработчик переключения копирования значения
   */
  onToggleClone(dep: any): void {
    if (dep.clone) {
      dep.condition = '';
    }
  }
}
