import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@shared/services/app.service';
import { WindowsWidthService } from '@shared/services/windows-width.service';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FpcFilterInterface } from '../../models/fpc-filter.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'fpc-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FilterComponent implements OnDestroy {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  @Input() set filter(value: FpcFilterInterface) {
    this.filterConfig = {
      main: {
        options: value.options,
        template: value.main,
      },
      secondary: {
        options: value.options,
        template: value.secondary,
      },
      united: {
        options: value.options,
        template: [...value.main, ...value.secondary],
      },
    };
  }

  @Input() loading: boolean;

  @Input() showFilerIcon: boolean = true;

  @Input() hideResultCount = false;

  readonly clearFilter$ = new Subject<void>();

  @Input() listSize: number | null;

  @Input() filterSize: number | null;

  @Input() showLegendButton: boolean = false;

  @Output() filterSubmitted = new EventEmitter<Record<string, any>>();

  @Output() legendButtonClicked = new EventEmitter<any>();

  showLegend: boolean = true;

  @Input() isSecondaryFilter = false;

  isMobile = false;

  private readonly destroy$ = new Subject<void>();

  private filterValue: Record<string, any> = {};

  filterConfig: {
    main: FpcInterface;
    secondary: FpcInterface;
    united: FpcInterface;
  };

  constructor(
    private windowWidthService: WindowsWidthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.windowWidthService
      .lessThanOrEqualTo$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
        this.isSecondaryFilter = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(value: Record<string, any>): void {
    this.filterValue = {
      ...this.filterValue,
      ...Object.keys(value).reduce((acc, key) => {
        if (value[key] === null || value[key] === undefined) {
          acc[key] = '';
        } else {
          acc[key] = value[key];
        }

        return acc;
      }, {}),
    };

    this.filterSubmitted.emit(this.filterValue);
  }

  toggleFilterVisibility(): void {
    this.isSecondaryFilter = !this.isSecondaryFilter;
  }

  onFormBuilt(form: FormGroup): void {
    form.patchValue(this.filterValue, { emitEvent: false });
  }

  toggleLegend(): void {
    this.showLegend = !this.showLegend;
    this.legendButtonClicked.emit();
  }
}
