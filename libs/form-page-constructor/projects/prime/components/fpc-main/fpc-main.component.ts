import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Optional,
  SimpleChanges
} from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { DialogService } from "primeng/dynamicdialog";
import { ActivatedRoute } from "@angular/router";
import { LOCALE } from "../../constants/locale.const";
import { PrimeNGConfig } from "primeng/api";
import { FpcShowFileDialogComponent } from "../fpc-show-file-dialog/fpc-show-file-dialog.component";
import { DaysOffInterface } from "../../models/days-off.interface";
import { DatePipe } from "@angular/common";
import { FpcMainComponent } from '../../../base/components/fpc-main/fpc-main.component';
import { ValidatorsUtils } from '../../../base/utils/validators.utils';
import { LocaleService } from '../../../base/services/locale.service';
import { DaysOffService } from '../../../base/services/days-off.service';
import { FileBase64 } from '../../../base/models/files.interface';
import moment from 'moment/moment';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'fpc-prime',
    templateUrl: './fpc-main.component.html',
    styleUrls: ['./fpc-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DatePipe
    ],
    standalone: false
})
export class FpcPrimeComponent extends FpcMainComponent implements OnChanges {
  @Input() set daysOff(v: DaysOffInterface) {
    this._daysOff = v;
    this.daysOffService.setDaysOff(v);
  };

  private _daysOff: DaysOffInterface;

  get daysOff(): DaysOffInterface {
    return this._daysOff;
  }
  @Input() set schedule(v: DaysOffInterface) {
    this._schedule = v;
    this.daysOffService.setSchedule(v);
  };

  private _schedule: DaysOffInterface;

  get schedule(): DaysOffInterface {
    return this._schedule;
  }

  constructor(
    protected fb: UntypedFormBuilder,
    protected validators: ValidatorsUtils,
    protected activatedRoute: ActivatedRoute,
    protected localeService: LocaleService,
    @Optional() protected dialogService: DialogService,
    private config: PrimeNGConfig,
    @Optional() protected daysOffService: DaysOffService,
    protected datePipe: DatePipe
  ) {
    super(
      fb,
      validators,
      activatedRoute,
      localeService,
      datePipe,
      daysOffService
    );
    this.config.setTranslation(LOCALE[this.dateLocale]);
  }

  openFileDialog(fileBase64: string | FileBase64): void {
    this.dialogService.open(FpcShowFileDialogComponent, {
      data: { fileBase64 },
      showHeader: false,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes?.dateLocale?.currentValue) {
      this.config.setTranslation(LOCALE[this.dateLocale]);
    }
  }

  removeSmartPrimeGroup(arg: {name: string, index: number}): void {
    const {name, index} = arg;
    if (!this.canRemoveSmartItem(name)) {
      return;
    }

    this.onArrSmartItemRemoved(name, index);

    const arrayControl: UntypedFormArray = this.form.get(name) as UntypedFormArray;
    arrayControl.removeAt(index);

    // Необходимо, чтоб разблокировать новое первое поле, если оно было удалено
    if (index === 0 && arrayControl.controls.length) {
      const onlyFirst = this.formData.template
        ?.find(data => data.formControlName === name)?.arrSmartList
        // @ts-ignore
        ?.filter(item => item.onlyFirst)
        ?.map(item => item.formControlName) || [];

      onlyFirst.forEach(v => {
        (arrayControl.controls[0].get(v) as UntypedFormControl).enable({ emitEvent: false });
      });
    }
  }

  transform(value: any): string {
    if (value === true) {
      return 'Да';
    }
    if (value === false) {
      return 'Нет';
    }
    return value;
  }

  controlIsHidden(controlName: string): boolean {
    // @ts-ignore
    return this.form?.get(controlName)?.hidden || false;
  }

  getMonthPickerValue(value: string, format: string) {
    return moment(value,format).format(format);
  }
}
