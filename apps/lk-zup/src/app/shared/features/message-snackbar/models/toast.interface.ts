import { MessageType } from './message-type.enum';

export interface ToastInterface {
  toast: {
    message: {
      header?: string;
      text: string;
    };
    type: MessageType;
  };
}
