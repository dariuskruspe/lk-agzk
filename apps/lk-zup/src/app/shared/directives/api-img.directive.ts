import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Environment } from '../classes/ennvironment/environment';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[apiImg]',
  standalone: true,
})
export class ApiImgDirective {
  apiImg = input<string>();

  el = inject(ElementRef);

  constructor() {
    effect(() => {
      const img = this.apiImg();
      if (img) {
        this.el.nativeElement.src = `${Environment.inv().api}/${img}`;
      }
    });
  }
}
