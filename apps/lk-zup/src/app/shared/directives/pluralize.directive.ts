import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { LangFacade } from '../features/lang/facades/lang.facade';
import { definePluralForm } from '../utilits/pluralize.util';

class PluralizeContext {
  public get $implicit() {
    return this.result;
  }

  public result: string | string[];

  public lang: 'ru' | 'en';
}

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[pluralize]',
    standalone: false
})
export class PluralizeDirective implements OnChanges {
  @Input() pluralize!: number;

  // по схеме: [1, 2-4, 0 и 5-19],
  // например ['объект', 'объекта', 'объектов'] и ['object', 'objects', 'objects']
  // Так же можно передать массив
  @Input('pluralizeForms') forms!: string[] | string[][];

  private context = new PluralizeContext();

  constructor(
    private vcr: ViewContainerRef,
    private template: TemplateRef<PluralizeContext>,
    private lang: LangFacade
  ) {}

  static ngTemplateContextGuard(
    dir: PluralizeDirective,
    ctx: unknown
  ): ctx is PluralizeContext {
    return true;
  }

  ngOnChanges(): void {
    if (typeof this.pluralize === 'number') {
      this.vcr.clear();
      this.context.lang = this.lang.getLang() as 'ru' | 'en';
      this.context.result = definePluralForm(
        this.pluralize,
        this.forms,
        this.context.lang
      );
      this.vcr.createEmbeddedView(this.template, this.context);
    }
  }
}
