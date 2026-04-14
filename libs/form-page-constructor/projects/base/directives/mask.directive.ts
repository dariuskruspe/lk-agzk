import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { ControlContainer, UntypedFormControl } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mask]',
  standalone: false,
})
export class MaskDirective implements OnInit, OnChanges, AfterViewInit {
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

  private isDatepicker = false;

  private control: UntypedFormControl;

  @Input() mask: string;

  @Input() value: string;

  @Input() inputId?: string;

  @HostListener('change') onChange(): void {
    return this.onBindValue();
  }

  @HostListener('input') onInput(): void {
    return this.onBindValue();
  }

  @HostListener('focus') onFocus(): void {
    return this.onBindValue();
  }

  constructor(
    private elementRef: ElementRef,
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    @Host() @Self() @Optional() public pCalendar: Calendar,
  ) {
    this.el = this.elementRef.nativeElement as HTMLInputElement;
    this.isDatepicker = this.el.tagName.toLowerCase() === 'p-calendar';
  }

  ngAfterViewInit(): void {
    const el = this.el.querySelector('input');
    if (el) {
      this.el = el;
    }
    if (this.isDatepicker) {
      this.control = this.controlContainer.control.get(
        this.inputId,
      ) as UntypedFormControl;
    }
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
    for (let i = 0; i < this.el?.value.length || 0; i += 1) {
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

    const val = this.bufferValue.join('');
    this.el.value = '';
    this.el.value = val;

    if (this.control) {
      const dmy = this.bufferValue.reduce((acc, letter) => {
        const index = acc.length ? acc.length - 1 : 0;
        if (!isNaN(+letter)) {
          acc[index] = '' + (acc[index] ?? '') + letter;
        } else {
          acc.push('');
        }

        acc[index] = +acc[index];
        return acc;
      }, []);

      // todo fix hard condition
      if (dmy.length === 3 && dmy[2] > 1900) {
        const date = new Date(
          dmy[2],
          this.bufferValue.includes('.') ? dmy[1] - 1 : dmy[0] - 1,
          this.bufferValue.includes('.') ? dmy[0] : dmy[1],
        );
        const utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
        this.control.setValue(utcDate);
        console.log(this.control);
      }
    }
  }
}
