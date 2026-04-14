import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { FileDownloadService } from '../../../../shared/services/file-download.service';
import { FileSanitizerClass } from '../../../../shared/utilits/download-file.utils';
import { Insurance, InsuranceResponse } from '../../models/insurance.interface';
import { InsuranceService } from '../../services/insurance.service';

@Component({
    selector: 'app-insurance-card',
    templateUrl: './insurance-card.component.html',
    styleUrls: ['./insurance-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InsuranceCardComponent implements OnChanges {
  apiUrl = Environment.inv().api;

  @Input() insurance: Insurance;

  @Output() changeClinic = new EventEmitter<{ insuranceProgram: string }>();

  @Output() deleteInsuranceProgram = new EventEmitter<{
    insuranceProgram: string;
  }>();

  @Output() changeInsuranceType = new EventEmitter<InsuranceResponse>();

  selectedInsurance: InsuranceResponse | null;

  insuranceCard: InsuranceResponse;

  constructor(
    private insuranceService: InsuranceService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownload: FileDownloadService
  ) {}

  selectInsurance(): void {
    this.insuranceCard = this.selectedInsurance;
    this.changeInsuranceType.emit(this.selectedInsurance);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.insurance) {
        this.selectedInsurance = this.insurance.insurance[0];
        this.selectInsurance();
      }
    }
  }

  downloadFile(itemSrc: string): void {
    if (!itemSrc) return;
    this.insuranceService.getInsuranceFile(itemSrc).subscribe((file) => {
      return this.fileDownload.download(
        this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
          file.file64,
          file.fileExtension
        ),
        file.fileName
      );
    });
  }

  changeInsuranceClinic(data: { insuranceProgram: string }): void {
    this.changeClinic.emit(data);
  }

  deleteInsurance(data: { insuranceProgram: string }): void {
    this.deleteInsuranceProgram.emit(data);
  }
}
