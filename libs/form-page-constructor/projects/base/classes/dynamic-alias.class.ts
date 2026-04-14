import { FpcInterface, OptionListRequestParamsInterface } from '../models/fpc.interface';
import {generateFunction} from "./dynamic.class";

export class DynamicAlias {
  private readonly baseAlias: string

  private readonly parentArray?: string;

  private readonly params: OptionListRequestParamsInterface[];

  private readonly controlName: string;

  private readonly buffered = new Map<string, string>();

  constructor(data: {
    alias: string;
    control: string;
    parent?: string | undefined;
    params: OptionListRequestParamsInterface[],
    index?: number
  }) {
    this.baseAlias = data.alias;
    this.params = data.params;
    this.controlName = data.control;
    this.parentArray = data.parent;
  }

  update(formValue: any, formData: FpcInterface, index?: number): [FpcInterface, string, string, string] {
    const modFormData = { ...formData };
    const oldAlias = this.getAlias();

    this.params?.forEach(param => {
      let value;
      let isFulfilled;
      if (param.condition) {
        try {
          // (!!!) ACHTUNG: использование eval (см. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
          // TODO: переделать на изолированный вызов eval в песочнице
          const func = eval(generateFunction(param.condition.condition));
          // const func = eval?.(`"use strict";(${generateFunction(param.condition.condition)})`); // (!!!) непрямой вызов eval (indirect call through optional chaining) не подошёл в данном случае -> локальные переменные ищутся в глобальной области видимости
          // const func = Function('"use strict"; return (' + generateFunction(param.condition.condition) + ')')(); // почему-то не работает :(
          isFulfilled = func(
            formValue[param.condition.control],
            null, null
          )
        } catch (e) {}

        if (isFulfilled) {
          value = formValue[param.control];
        } else {
          value = formValue[param.secondControl];
        }
      } else {
        value = this.getValueByControlName(formValue, param.control, index);
      }
      if (value && typeof value !== 'string') {
        value = value.toISOString();
      }
      this.merge(param.name, value);
    });

    const updatedAlias = this.getAlias();

    if (oldAlias === updatedAlias) {
      return [formData, '', this.parentArray, this.controlName];
    }

    modFormData.template = modFormData.template.map(data => {
      // if (this.parentArray && data.formControlName === this.parentArray) {
      //   return {
      //     ...data,
      //     arrSmartList: data.arrSmartList?.map(v => {
      //       if (v.formControlName === this.controlName) {
      //         return {
      //           ...v,
      //           optionListRequestAlias: updatedAlias
      //         }
      //       }
      //       return v;
      //     })
      //   };
      // }

      if (data.formControlName === this.controlName) {
        return {
          ...data,
          optionListRequestAlias: updatedAlias
        };
      }

      return data;
    });

    return [modFormData, updatedAlias, this.parentArray, this.controlName];
  }

  /** Актуальный ключ optionList после последнего вызова update (с query-параметрами). */
  getResolvedAlias(): string {
    return this.getAlias();
  }

  getValueByControlName(formValue: any, controlName: string, index?: number): string {
    if (Object.keys(formValue).includes(controlName)) {
      return formValue[controlName]
    } else if (this.parentArray && (index || index === 0) && formValue[this.parentArray][index] ) {
      return formValue[this.parentArray][index][controlName];
    }
    return null;
  }

  private merge(name: string, value: any): DynamicAlias {
    this.buffered.set(name, value);
    return this;
  }

  private getAlias(): string {
    const params = Array.from(this.buffered.keys())
      .filter(v => !!this.buffered.get(v))
      .sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      })
      .reduce((acc, key) => {
        const param = `${key}=${encodeURIComponent(this.buffered.get(key))}`;
        return acc ? `${acc}&${param}` : param;
      }, '');
    return params ? `${this.baseAlias}?${params}` : this.baseAlias;
  }
}
