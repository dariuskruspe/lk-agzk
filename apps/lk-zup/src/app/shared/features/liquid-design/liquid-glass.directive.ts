import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appLiquidGlass]',
})
export class LiquidGlassDirective {
  private elementRef = inject(ElementRef);

  ngAfterViewInit() {
    console.log('el', this.elementRef.nativeElement);
  }
}
