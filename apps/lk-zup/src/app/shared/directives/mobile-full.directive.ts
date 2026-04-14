import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mobileFull]',
  standalone: true,
})
export class MobileFullDirective implements AfterContentInit {
  @Input() mobileFull: number = 75;

  constructor(private el: ElementRef) {}

  ngAfterContentInit(): void {
    requestAnimationFrame(() => {
      this.el.nativeElement.style.height = `${
        window.innerHeight - this.mobileFull
      }px`;
    });
  }
}
