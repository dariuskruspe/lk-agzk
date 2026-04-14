import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { SupportHelpMainInterface } from '@app/features/support/models/support-help.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dashboard-cutom-widgets-dialog',
  templateUrl: './dashboard-cutom-widgets-dialog.component.html',
  styleUrls: ['./dashboard-cutom-widgets-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardCustomWidgetsDialogComponent implements OnInit {

  content: SupportHelpMainInterface[];
  template: string;

  constructor(public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.content = this.config.data.content;
    this.template = this.config.data.template;
  }
}
