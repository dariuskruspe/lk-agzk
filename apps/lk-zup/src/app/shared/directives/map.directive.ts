import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

class ValueContext {
  public get $implicit() {
    return this.result;
  }

  public result: any;
}

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[map]',
    standalone: false
})
export class MapDirective implements OnChanges {
  @Input('map') value!: any;

  @Input('mapHandler') handler!: (value: any) => any;

  private context = new ValueContext();

  constructor(
    private readonly templateRef: TemplateRef<ValueContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  static ngTemplateContextGuard(
    dir: ValueContext,
    ctx: unknown
  ): ctx is ValueContext {
    return true;
  }

  ngOnChanges(): void {
    if (this.value) {
      this.viewContainerRef.clear();
      this.context.result = this.handler
        ? this.handler(this.value)
        : this.value;
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    }
  }
}
