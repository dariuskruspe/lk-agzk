import {
  Directive,
  inject,
  Input,
  OnChanges,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { AppService } from '@shared/services/app.service';
import { formatNumber } from '@shared/utils/number/common';

class ColoredNumberContext {
  public get $implicit() {
    return this.value;
  }

  public value: string;
}

@Directive({
    selector: 
    // eslint-disable-next-line @angular-eslint/directive-selector
    '[coloredNumber],[coloredNumberBounds][coloredNumberSigns][coloredNumberSuffix][coloredNumberNeutral]',
    standalone: false
})
export class ColoredNumberDirective implements OnChanges {
  app: AppService = inject(AppService);

  langTagSignal: WritableSignal<string> =
    this.app.storage.settings.data.frontend.signal.langTag;

  @Input() coloredNumber: number;

  // [negative upper bound, positive lower bound]
  @Input() coloredNumberBounds?: [number, number] = [0, 0];

  @Input() coloredNumberNeutral?: boolean = false;

  // [positive sign, negative sign]
  @Input() coloredNumberSigns?: [string, string] = ['- ', '+ '];

  @Input() coloredNumberSuffix? = '';

  private readonly COLORS_CLASSES = {
    positive: 'colored-number_positive',
    negative: 'colored-number_negative',
    neutral: 'colored-number_neutral',
  };

  private context = new ColoredNumberContext();

  constructor(
    private vcr: ViewContainerRef,
    private template: TemplateRef<ColoredNumberContext>,
    private renderer: Renderer2
  ) {}

  static ngTemplateContextGuard(
    dir: ColoredNumberDirective,
    ctx: unknown
  ): ctx is ColoredNumberContext {
    return true;
  }

  ngOnChanges(): void {
    if (this.coloredNumberNeutral) {
      this.coloredNumberBounds = [-Infinity, Infinity];
    }
    if (typeof this.coloredNumber === 'number') {
      this.vcr.clear();
      const [value, colorClass] = this.parseNumber();
      this.context.value = value;
      const viewRef = this.vcr.createEmbeddedView(this.template, this.context);
      this.renderer.addClass(viewRef.rootNodes[0], colorClass);
    }
  }

  private parseNumber(): [string, string] {
    if (this.coloredNumber > this.coloredNumberBounds[1]) {
      const formattedUnsignedNumber: string = formatNumber(
        Math.abs(this.coloredNumber),
        this.langTagSignal() || 'en-US'
      );
      return [
        `${this.coloredNumberSigns[1]}${formattedUnsignedNumber}${this.coloredNumberSuffix}`,
        this.COLORS_CLASSES.positive,
      ];
    }
    if (this.coloredNumber < this.coloredNumberBounds[0]) {
      const formattedUnsignedNumber: string = formatNumber(
        Math.abs(this.coloredNumber),
        this.langTagSignal() || 'en-US'
      );
      return [
        `${this.coloredNumberSigns[0]}${formattedUnsignedNumber}${this.coloredNumberSuffix}`,
        this.COLORS_CLASSES.negative,
      ];
    }
    return [
      `${this.coloredNumber}${this.coloredNumberSuffix}`,
      this.COLORS_CLASSES.neutral,
    ];
  }
}
