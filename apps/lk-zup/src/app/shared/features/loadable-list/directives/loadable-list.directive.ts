import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[componentHost]',
    standalone: false
})
export class LoadableListDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
