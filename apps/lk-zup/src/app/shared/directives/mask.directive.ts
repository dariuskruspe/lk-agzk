import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[mask]',
    standalone: false
})
export class MaskDirective implements OnInit, OnChanges {
  el: HTMLInputElement;

  symbolsMask = [
    '!',
    '@',
    '#',
    '№',
    '$',
    ';',
    '%',
    ':',
    '^',
    '&',
    '?',
    '*',
    '(',
    ')',
    '[',
    '{',
    '}',
    ']',
    '/',
    '|',
    '\\',
    '"',
    "'",
    '-',
    '+',
    '_',
    '.',
    ' ',
  ];

  maskTemplate: string[];

  bufferValue: string[];

  @Input() mask: string;

  @Input() value: string;

  @HostListener('change') onChange(): void {
    return this.onBindValue();
  }

  @HostListener('input') onInput(): void {
    return this.onBindValue();
  }

  @HostListener('focus') onFocus(): void {
    return this.onBindValue();
  }

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement as HTMLInputElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.mask?.currentValue) {
      this.bindMaskTemplate();
      if (this.el.value) {
        this.bindValue();
      }
    }
  }

  ngOnInit(): void {
    if (this.mask) {
      this.bindMaskTemplate();
      if (this.el.value) {
        this.bindValue();
      }
    }
  }

  onBindValue(): void {
    if (this.mask) {
      this.bindValue();
    }
  }

  bindMaskTemplate(): void {
    this.maskTemplate = [];
    for (const item of this.mask) {
      let typeItem: string;
      if (this.symbolsMask.indexOf(item) === -1) {
        typeItem = Number.isNaN(+item) ? 'letter' : 'numeral';
      } else {
        typeItem = item;
      }
      this.maskTemplate.push(typeItem);
    }
  }

  bindValue(): void {
    this.bufferValue = [];
    for (let i = 0; i < this.el.value.length; i += 1) {
      if (this.maskTemplate[i]) {
        if (this.symbolsMask.indexOf(this.el.value[i]) === -1) {
          if (
            this.maskTemplate[i] !== 'numeral' &&
            this.maskTemplate[i] !== 'letter'
          ) {
            this.bufferValue.push(this.maskTemplate[i]);
            this.bufferValue.push(this.el.value[i]);
          } else if (Number.isNaN(+this.el.value[i])) {
            if (this.maskTemplate[i] === 'letter') {
              this.bufferValue.push(this.el.value[i]);
            }
          } else if (this.maskTemplate[i] === 'numeral') {
            this.bufferValue.push(this.el.value[i]);
          }
        } else if (this.el.value[i] === this.maskTemplate[i]) {
          this.bufferValue.push(this.el.value[i]);
        }
      }
      this.el.setSelectionRange(i, i);
    }
    this.el.value = '';
    this.el.value = this.bufferValue.join('');
  }
}
