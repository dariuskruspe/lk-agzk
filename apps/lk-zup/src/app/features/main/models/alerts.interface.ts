export interface AlertsInterface {
  general: string[];
  actions: ActionAlertInterface[];
}

export interface ActionAlertInterface {
  objects: string[];
  pushId?: string;
  type: Action;
  text: string;
  title: string;
}

export type Action = 'confirmByOtherApp' | ConfirmationAction;

export type ConfirmationAction =
  | 'signingConfirmBySMS'
  | 'signatureReleaseConfirmBySMS';

export function isConfirmationAction(v: Action): v is ConfirmationAction {
  return v === 'signingConfirmBySMS' || v === 'signatureReleaseConfirmBySMS';
}
