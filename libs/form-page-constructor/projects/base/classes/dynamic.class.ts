import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  AddictedFieldInterface,
  FpcInputsInterface,
  FpcInterface,
} from '../models/fpc.interface';
import moment from 'moment';

// Чтоб в шаблоне использовать функцию m() для создания условий
export function m(date: string): moment.Moment {
  return moment(date);
}

export function generateFunction(condition: string): string {
  return `($V,$T,$F)=>${condition}`;
}

export class Dynamic {
  private static form: UntypedFormGroup;

  private static formData: FpcInterface;

  private static bufferDisabled: Set<string>;

  private static daysOff: Record<string, string>;

  private data: AddictedFieldInterface;

  private buffer = new Map();

  // функция генерируется в конструкторе
  private readonly func: (v: any, t: any, f: any) => {};

  constructor(data: AddictedFieldInterface) {
    this.data = data;
    if (this.data.condition) {
      try {
        // (!!!) ACHTUNG: использование eval (см. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
        // TODO: переделать на изолированный вызов eval в песочнице
        this.func = eval(generateFunction(this.data.condition));
        // this.func = eval?.(`"use strict";(${generateFunction(this.data.condition)})`); // (!!!) непрямой вызов eval (indirect call through optional chaining) не подошёл в данном случае -> локальные переменные ищутся в глобальной области видимости
        // this.func = Function('"use strict"; return (' + generateFunction(this.data.condition) + ')')(); // почему-то не работает :(
      } catch (e) {}
    }
  }

  static setForm(form: UntypedFormGroup): void {
    Dynamic.form = form;
  }

  static setFormData(formData: FpcInterface): void {
    Dynamic.formData = formData;
  }

  static setBufferDisabled(bufferDisabled: Set<string>): void {
    Dynamic.bufferDisabled = bufferDisabled;
  }

  update(): void {
    this.controls.forEach((item) => {
      let enabled = true;
      let needClearance = false;

      if (!this.buffer.has(item.master?.[0])) {
        this.buffer.set(item.master?.[0], []);
      }
      const buffer = this.buffer.get(item.master?.[0]);

      const previousBufferValues = buffer.slice();

      for (let i = 0; i < item.master.length; i++) {
        if (!buffer[i]) {
          buffer[i] = item.master[i]?.value;
        }
        if (!this.equal(buffer[i], item.master[i]?.value)) {
          buffer[i] = item.master[i]?.value;
          needClearance = true;
        }
        if (
          (!item.master[i]?.value && item.master[i]?.value !== false) ||
          !this.isValid(item.master[i])
        ) {
          enabled = false;
          needClearance = true;
          break;
        }
      }

      switch (true) {
        // Динамическое отображение/скрытие поля
        case !!this.data.condition:
          try {
            const master = item.master[0];
            const addicted = item.addicted[0];
            const isHidden = !this.func(
              master.value,
              // @ts-ignore
              master._dayType,
              this.parentArrayName
                ? Dynamic.form.get(this.parentArrayName).value
                : Dynamic.form.value,
            );

            if (addicted) {
              // @ts-ignore
              addicted.hidden = isHidden;
              // @ts-ignore
              addicted.setHidden?.(isHidden, !this.parentArrayName);
            }
          } catch (e) {
            console.log(
              'Некорректное condition-выражение в шаблоне:',
              this.data.condition,
              e,
            );
          }
          break;
        // Клонирование значения с другого поля
        case this.data.clone:
          try {
            const master = item.master[0];
            // Проверяем, не скрыто ли master-поле в первом элементе массива
            // Если скрыто, не клонируем значение
            const isMasterHidden = (master as any)?.hidden === true;

            if (isMasterHidden) {
              // Если master-поле скрыто, не клонируем значение
              break;
            }

            const masterValue = master.value;
            item.addicted.forEach((control) => {
              // control.setValue(master.value, { emitEvent: false });
              const controlValue = control.value;
              // Определяем, является ли значение пустым/по умолчанию
              const isEmpty =
                controlValue === null ||
                controlValue === undefined ||
                controlValue === '' ||
                (typeof controlValue === 'object' &&
                  controlValue !== null &&
                  Object.keys(controlValue).length === 0);

              // Клонируем только если:
              // 1. Значение в master-поле изменилось И значение в addicted-поле совпадает со старым значением master (не было изменено пользователем)
              // 2. ИЛИ значение в addicted-поле пустое (нужно инициализировать при добавлении нового элемента)
              const previousMasterValue = previousBufferValues[0];
              const shouldClone =
                (needClearance &&
                  previousMasterValue !== undefined &&
                  this.equal(controlValue, previousMasterValue)) ||
                isEmpty;

              if (shouldClone) {
                control.setValue(masterValue, { emitEvent: false });
              }
            });
          } catch (e) {
            console.log(
              'Клонирование не выполнено, неверно указаны названия полей для клонирования',
            );
          }
          break;
        // Блокировка поля
        default:
          const addicted = item.addicted[0];
          if (enabled) {
            Dynamic.bufferDisabled.delete(this.data.controlName);
            addicted?.enable({ emitEvent: false });
          } else {
            Dynamic.bufferDisabled.add(this.data.controlName);
            addicted?.disable({ emitEvent: false });
          }
          break;
      }

      this.updateDependentFields();
    });
  }

  /**
   * Обновляем зависимые поля формы.
   */
  updateDependentFields(): void {
    const form = Dynamic.form;
    const formData = Dynamic.formData;

    const templates: FpcInputsInterface[] = formData.template;
    const templatesWithDependencies: FpcInputsInterface[] = templates.filter(
      (t) => t.dependent?.length,
    );

    for (const field in form.controls) {
      // 'field' is a string
      const fieldTemplate: FpcInputsInterface = templatesWithDependencies.find(
        (t) => t.formControlName === field,
      );
      if (!fieldTemplate) continue;

      // управляющее поле
      const masterControl = form.get(field); // 'masterControl' is a FormControl

      // скрываем зависимые поля, если управляющее ими поле скрыто (см. HRM-40409)
      if ((masterControl as any)?.hidden) {
        // проходим по объектам, содержащим данные зависимых полей в шаблоне скрытого управляющего поля
        for (const dependent of fieldTemplate.dependent) {
          const dependentControlName: string = dependent.control;
          const dependentControl = form.get(dependentControlName);

          if (!dependentControl) continue;

          if (typeof (dependentControl as any)?.setHidden === 'function') {
            (dependentControl as any).setHidden(true);
          } else {
            // для static и прочих полей, у которых нет директивы formField
            (dependentControl as any).hidden = true;
          }
        }
      }
    }
  }

  private equal(a: any, b: any): boolean {
    if (
      typeof a === 'string' ||
      typeof a === 'boolean' ||
      typeof a === 'number'
    ) {
      return a === b;
    }
    if ((a as Date)?.toISOString || (b as Date)?.toISOString) {
      return new Date(a)?.toString() === new Date(b)?.toString();
    }
    return false;
  }

  private isValid(control: AbstractControl): boolean {
    return control.status === 'VALID' || !control.invalid;
  }

  private get controls(): {
    master: UntypedFormControl[];
    addicted: UntypedFormControl[];
  }[] {
    const _controls = [];
    try {
      if (this.parentArrayName) {
        const { controls } = Dynamic.form.get(
          this.parentArrayName,
        ) as UntypedFormArray;
        if (this.data.clone && controls?.length) {
          _controls.push({
            master: this.data.fields.map((field) => controls[0].get(field)),
            addicted: controls
              .filter((value, index) => index > 0)
              .map((control) => control.get(this.data.controlName)),
          });
        } else {
          controls.forEach((childControl) => {
            _controls.push({
              master: this.data.fields.map((field) => childControl.get(field)),
              addicted: [childControl.get(this.data.controlName)],
            });
          });
        }
      } else {
        _controls.push({
          master: this.data.fields.map((field) => Dynamic.form.get(field)),
          addicted: [Dynamic.form.get(this.data.controlName)],
        });
      }
    } catch (e) {
      console.log(e);
    }
    return _controls;
  }

  private get parentArrayName(): string | null {
    return this.data.parentArrayName;
  }
}
