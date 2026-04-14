import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[skeleton][skeletonElse],[skeletonRepeat]',
    standalone: false
})
export class AppSkeletonDirective implements OnChanges {
  @Input()
  skeleton: unknown = false;

  @Input()
  skeletonElse: TemplateRef<unknown> | null = null;

  @Input()
  skeletonRepeat?: number = 1;

  private skeletonRef: EmbeddedViewRef<unknown> | null = null;

  private viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<unknown>
  ) {}

  ngOnChanges(): void {
    if (!this.skeleton && !this.skeletonRef && this.skeletonElse) {
      this.skeletonRef = this.vcr.createEmbeddedView(this.skeletonElse);
      for (let i = 1; i < this.skeletonRepeat; i++) {
        this.vcr.createEmbeddedView(this.skeletonElse);
      }
      return;
    }

    if (this.viewRef || this.skeletonRef) {
      this.viewRef?.destroy();
      this.skeletonRef?.destroy();
      this.skeletonRef = null;
      this.viewRef = null;
      this.vcr.clear();
    }
    this.viewRef = this.vcr.createEmbeddedView(this.templateRef);
  }
}
