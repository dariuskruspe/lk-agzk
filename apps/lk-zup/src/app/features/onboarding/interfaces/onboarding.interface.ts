export interface OnboardingInterface {
  settings: OnboardingSettingsInterface;
  items: OnboardingItemInterface[];
}

export type Position =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface OnboardingItemInterface {
  path: string;
  image?: string;
  position?: Position;
  indent?: [number, number];
  arrow?: boolean;
  untouchableTarget?: boolean;
  title: string;
  description: string;
  paragraph?: string;
  confirmButtonLabel?: string;
  rejectButtonLabel?: string;
  linkLabel?: string;
  linkAction?: OnboardingActions;
  action: OnboardingActions;
  actionRedirect?: string;
  closable?: boolean;
  numbered?: boolean;
  targetSelector?: string;
  requiredSelectors?: string[];
  scrollContainerSelector?: string;
  highlightTarget?: boolean;
  bgType: 'none' | 'shadow' | 'transparent';
  imageBg?: string;
  closeBg?: string;
  cardColor?: string;
  width: number;
  isForm?: boolean;
  imgPadding?: string;
  owner?: string;
}

export interface OnboardingSettingsInterface {
  pathBlackList?: string[];
  continueFromLastStep: boolean;
  description: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  bgType: 'shadow' | 'transparent';
  formDescription?: string;
  formImage?: string;
  continueImage?: string;
  platform?: 'browser' | 'mobile';
  name: string;
}

export type OnboardingActions =
  | 'close'
  | 'redirect'
  | 'route'
  | 'next'
  | 'end'
  | 'submit'
  | 'openForm'
  | 'continue';

export interface OnboardingTargetPositionPxInterface {
  ['top.px']?: number;
  ['left.px']?: number;
  ['width.px']?: number;
  ['height.px']?: number;
}

export interface OnboardingPositionPxInterface {
  ['width.px']?: number;
  ['height.px']?: number;
  x?: number;
  y?: number;
}

export interface ClosedOnboardingInterface {
  isFinished: boolean;
  stepIndex: number;
  isSkipped: boolean;
  contacts?: ContactsInterface;
}

export interface ContactsInterface {
  name: string;
  phone: string;
  email: string;
}
