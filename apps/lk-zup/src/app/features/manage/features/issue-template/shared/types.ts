import {
  IssuesTypesTemplateInterface,
  IssueTypeTemplateFieldMappingInterface,
} from '@app/features/issues/models/issues-types.interface';
import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';

export interface FormFieldItem {
  name: string;
  type:
    | 'static'
    | 'computed-static'
    | 'text'
    | 'password'
    | 'number'
    | 'hidden'
    | 'timepicker'
    | 'datepicker'
    | 'datepicker-month'
    | 'datepicker-year'
    | 'datepicker-range-start'
    | 'datepicker-range-end'
    | 'file'
    | 'file-multi'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'ref'
    | 'select'
    | 'select-employee'
    | 'select-filter'
    | 'select-multi'
    | 'arr-smart'
    | 'static-files';
  settings?: { [key: string]: string | number | boolean | string[] };
  arrSmartList?: FormFieldItem[];
}

export type IssueTemplateBuilderFieldEvent = {
  path: string[];
};

export interface IssueTemplateValue {
  template: FpcInputsInterface[];
  formFields: IssueTypeTemplateFieldMappingInterface[];
  settings: IssueTemplateSettingsInterface;
}

export interface IssueTemplateSettingsInterface {
  FullName: string; // полное название
  ShortName: string; // краткое название
  description: string; // описание
  showInSelectionList: boolean; // показывать в списке
  quickAccess: boolean; // быстрый доступ
  onApplicant: boolean;
  onOtherEmployees: boolean;
  iconName: string; // иконка
  createByAssistant: boolean; // включено ли создание этого типа заявки через ИИ ассистента
  aiPrompt: string; // дополнительная информация о заявке для улучшения работы ИИ ассистента
}
