import { Directive, ElementRef, inject, effect } from '@angular/core';
import { bindStickyClass } from '@app/shared/utilits/bind-sticky-class';

@Directive({
  selector: '[appBindStickyClass]',
  standalone: true,
})
export class BindStickyClassDirective {
  unbindStickyClass: ReturnType<typeof bindStickyClass>;

  private el = inject(ElementRef);

  ngAfterViewInit() {
    this.unbindStickyClass = bindStickyClass(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.unbindStickyClass?.();
  }
}
