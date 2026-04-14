import {
  FpcInputsInterface,
  FpcOptionInterface,
} from '@wafpc/base/models/fpc.interface';

export interface FpcFilterInterface {
  main: FpcInputsInterface[];
  secondary: FpcInputsInterface[];
  options: FpcOptionInterface;
}
