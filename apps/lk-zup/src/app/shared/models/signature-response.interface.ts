import { ToastInterface } from '../features/message-snackbar/models/toast.interface';

export interface SignatureResponseInterface {
  message?: {
    header?: string;
    text?: string;
  };
  success?: boolean;
  link?: string;
  requestID?: string;
  releaseIssueID?: string;
  signingData?: {
    toast?: ToastInterface;
  }[];
  displayConfirmationCodeWindow?: boolean;
}
