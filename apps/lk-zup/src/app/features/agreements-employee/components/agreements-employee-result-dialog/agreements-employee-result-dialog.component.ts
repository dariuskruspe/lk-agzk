import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';

@Component({
    selector: 'app-agreements-employee-result-dialog',
    templateUrl: './agreements-employee-result-dialog.component.html',
    styleUrls: ['./agreements-employee-result-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsEmployeeResultDialogComponent implements OnInit {
  items = [];
  // {
  //   fileID: 'c642add0-fef2-11ed-95d0-90a1611e69a6',
  //   errorMsg:
  //     'На текущий момент Вы не являетесь согласующим лицом по заявке 000000079. Письма направлены актуальным согласующим',
  // },
  // {
  //   fileID: 'c642add0-fef2-11ed-95d0-90a1611e69a6',
  //   errorMsg:
  //     'На текущий момент Вы не являетесь согласующим лицом по заявке 000000079. Письма направлены актуальным согласующим',
  // },
  // {
  //   fileID: 'c642add0-fef2-11ed-95d0-90a1611e69a6',
  //   errorMsg:
  //     'На текущий момент Вы не являетесь согласующим лицом по заявке 000000079. Письма направлены актуальным согласующим',
  // },

  tasks: AgreementEmployeeDocumentPageInterface[] = [];
  // {
  //   employeeName: 'Смитт Ильшат Иванович',
  //   fileID: 'c642add0-fef2-11ed-95d0-90a1611e69a6',
  //   fileName: 'Тест (от 30.05.2023).pdf',
  //   fileOwner: 'issue',
  //   forEmployee: false,
  //   iconName: 'icon-doc',
  //   id: 'c642add0-fef2-11ed-95d0-90a1611e69a6',
  //   mandatory: true,
  //   name: 'Тест (от 30.05.2023)',
  //   state: '680e9c1d-5e55-11ec-810e-00155d28d802',
  //   stateDate: '2023-05-31T14:09:29',
  // },

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

  getTaskById(id: string): AgreementEmployeeDocumentPageInterface {
    return this.tasks.find((task) => task.fileID === id);
  }

  close(): void {
    this.dialogRef.close();
  }
}
