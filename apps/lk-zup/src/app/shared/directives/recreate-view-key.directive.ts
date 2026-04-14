import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * @description
 * This directive is used to fully recreate the view when the key changes.
 */

@Directive({
  selector: '[appRecreateViewKey]',
  standalone: true,
})
export class RecreateViewDirective implements OnChanges {
  @Input('appRecreateViewKey') key: unknown;

  private viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key']) {
      this.destroyView();

      if (this.key !== null && this.key !== undefined) {
        this.createView();
      }
    }
  }

  private createView(): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private destroyView(): void {
    this.viewRef?.destroy();
    this.viewRef = null;
  }
}
