import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';

export interface FpcFieldSettingsForm {
  tabs: FpcFieldSettingsFormTab[];
}

export type FpcFieldSettingsInput = FpcInputsInterface & {
  weight?: number;
};

export interface FpcFieldSettingsFormTab {
  name: string;
  title: string;
  weight?: number;
  fields: FpcFieldSettingsInput[];
}
