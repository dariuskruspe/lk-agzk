import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-vacations-text-dialog',
    templateUrl: './vacations-text-dialog.component.html',
    styleUrls: ['./vacations-text-dialog.component.scss'],
    standalone: false
})
export class VacationsTextDialogComponent implements OnInit {
  text: string;

  buttonLabel: string;

  constructor(
    public dialogRef: DynamicDialogRef,
    protected config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.text = this.config.data.text;
    this.buttonLabel = this.config.data.buttonLabel;
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
