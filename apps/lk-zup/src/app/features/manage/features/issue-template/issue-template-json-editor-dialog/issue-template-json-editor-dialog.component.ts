import {
  Component,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CodemirrorComponent } from '@app/shared/codemirror/codemirror.component';

@Component({
    selector: 'app-issue-template-json-editor-dialog',
    imports: [CommonModule, FormsModule, ButtonModule, CodemirrorComponent],
    template: `
    <div class="json-editor-container">
      <app-codemirror
        class="json-editor"
        value
        [value]="jsonText"
        [(value)]="jsonText"
        rows="25"
        spellcheck="false"
      ></app-codemirror>

      <div class="json-editor-footer">
        <div class="json-editor-actions">
          <p-button
            label="Отмена"
            icon="pi pi-times"
            styleClass="p-button-outlined"
            (onClick)="close()"
          ></p-button>
          <p-button
            label="Применить"
            icon="pi pi-check"
            (onClick)="apply()"
          ></p-button>
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      .json-editor-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .json-editor {
        padding-bottom: 50px;
      }

      .json-editor-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 12px;
        background: #fff;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
      }

      .json-validation-status {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #f44336;
      }

      .json-validation-status.is-valid {
        color: #4caf50;
      }

      .json-editor-actions {
        display: flex;
        gap: 8px;
      }
    `,
    ]
})
export class IssueTemplateJsonEditorDialogComponent implements OnInit {
  jsonText = signal<string>('');

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    if (this.config.data?.jsonText) {
      this.jsonText.set(this.config.data.jsonText);
    }
  }

  apply(): void {
    this.ref.close({ templateJson: this.jsonText() });
  }

  close(): void {
    this.ref.close();
  }
}
