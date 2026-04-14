import { PushDevice } from './push-device.enum';

export interface PushAdapter {
  isEnabled(): Promise<boolean>;
  getPermissions(): Promise<PushPermissions>;
  getPushSubscription(): Promise<any>;
  requestPermissions(): Promise<boolean>;

  readonly type: PushDevice;
}

export type PushPermissions = 'default' | 'denied' | 'granted';
