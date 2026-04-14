import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[attention],[attention][attentionStyle]',
    standalone: false
})
export class AttentionDirective implements OnChanges {
  @Input() attention: boolean;

  @Input() attentionStyle: string = 'bottom: 17px; right: 15px;';

  private point: HTMLDivElement = document.createElement('div');

  private readonly viewRef: EmbeddedViewRef<unknown>;

  private readonly node: HTMLElement;

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<unknown>,
    private renderer: Renderer2
  ) {
    this.viewRef = this.vcr.createEmbeddedView(this.templateRef);
    this.node = this.viewRef.rootNodes?.[0];

    this.renderer.setStyle(this.node, 'position', 'relative');

    this.renderer.addClass(this.point, 'attention-point');
    this.renderer.addClass(this.point, 'animation-flash');
    this.point.style.cssText += this.attentionStyle;
  }

  ngOnChanges(): void {
    if (this.attention && this.node) {
      this.renderer.appendChild(this.node, this.point);
    } else {
      this.renderer.removeChild(this.node, this.point);
    }
  }
}
