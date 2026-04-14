import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentInterface } from '../../models/document.interface';

@Component({
    selector: 'app-agreements-result-dialog',
    templateUrl: './agreements-result-dialog.component.html',
    styleUrls: ['./agreements-result-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsResultDialogComponent implements OnInit {
  items = [];

  tasks: DocumentInterface[] = [];

  success = true;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.success = this.config.data.success;
    if (!this.success) {
      this.tasks = this.config.data.tasks;
      this.items = this.config.data.results;
    }
  }

  getTaskById(id: string): DocumentInterface {
    return this.tasks.find((task) => task.fileID === id);
  }

  close(): void {
    this.dialogRef.close();
  }
}
