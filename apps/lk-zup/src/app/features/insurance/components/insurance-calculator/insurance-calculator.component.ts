import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  InsuranceCalculatorResponse,
  InsuranceResponse,
} from '@features/insurance/models/insurance.interface';
import { InsuranceService } from '@features/insurance/services/insurance.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-insurance-calculator',
    templateUrl: './insurance-calculator.component.html',
    styleUrls: ['./insurance-calculator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InsuranceCalculatorComponent {
  options: {
    cities: { representation: string; value: string }[];
    grades: { representation: string; value: string }[];
    dates: { representation: string; value: string }[];
  } = {
    cities: [],
    grades: [],
    dates: [],
  };

  currentInsurance: InsuranceResponse;

  loadingOptions = false;

  loadingCalculatorResponse = false;

  calculatorResponse: InsuranceCalculatorResponse | undefined;

  optionsValue: {
    city: string;
    grade: string;
    date: string;
  } = {
    city: undefined,
    grade: undefined,
    date: undefined,
  };

  counterValues = [];

  constructor(
    public insuranceService: InsuranceService,
    public config: DynamicDialogConfig,
    private localstorageService: LocalStorageService,
    private ref: ChangeDetectorRef
  ) {
    if (this.config.data?.currentInsurance) {
      this.currentInsurance = this.config.data.currentInsurance;
      this.getOptionLists().then(() => {
        this.loadingOptions = false;
        this.ref.detectChanges();
      });
    } else {
      this.getCurrentInsurance(this.config.data?.typeId).then(() => {
        this.getOptionLists().then(() => {
          this.loadingOptions = false;
          this.ref.detectChanges();
        });
      });
    }
  }

  async getCurrentInsurance(typeId: string | undefined): Promise<void> {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    const { insurance: insuranceList } = await firstValueFrom(
      this.insuranceService.getInsurance(currentEmployeeId)
    );
    if (typeId) {
      this.currentInsurance = insuranceList.find(
        (insurance) => insurance.insuranceType === typeId
      );
    } else {
      this.currentInsurance = insuranceList.find(
        (insurance) => insurance.insuranceCalculator
      );
    }
  }

  async getOptionLists(): Promise<void> {
    const { optionList: cities } = await firstValueFrom(
      this.insuranceService.getOptionList(
        this.currentInsurance.optionListCities
      )
    );
    const { optionList: grades } = await firstValueFrom(
      this.insuranceService.getOptionList(
        this.currentInsurance.optionListGrades
      )
    );
    const { optionList: dates } = await firstValueFrom(
      this.insuranceService.getOptionList(
        this.currentInsurance.optionListInsuranceDates,
        this.currentInsurance.insuranceType
      )
    );
    this.options = { cities, grades, dates };
  }

  async getCalculate(): Promise<void> {
    this.loadingCalculatorResponse = true;
    this.counterValues = [];
    await firstValueFrom(
      this.insuranceService.getInsuranceCalculate(
        this.currentInsurance.insuranceType,
        this.optionsValue.city,
        this.optionsValue.grade,
        this.optionsValue.date
      )
    ).then((data) => {
      this.calculatorResponse = data;
      this.calculatorResponse.insurancePrograms.forEach(() => {
        this.counterValues.push(0);
      });
      this.loadingCalculatorResponse = false;
      this.ref.detectChanges();
    });
  }

  isDate(value: string | number): boolean {
    return typeof value === 'string';
  }

  getTotalValue(): string {
    let result: number = 0;
    this.calculatorResponse.insurancePrograms.forEach((program, index) => {
      if (this.counterValues[index]) {
        const sumByProgram: number =
          +program.fields.find((prog) => prog.isTotal)?.value || program.amount;
        result = result + sumByProgram * this.counterValues[index];
      }
    });
    return isNaN(result) ? '0' : result.toFixed(2);
  }

  changeCount(count: number, index: number): void {
    this.counterValues[index] = count;
  }
}
