import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Environment } from '../../../classes/ennvironment/environment';
import {
  PushAdapter,
  PushPermissions,
} from '../interfaces/push-adapter.interface';
import { PushDevice } from '../interfaces/push-device.enum';

@Injectable()
export class PushWebAdapter implements PushAdapter {
  readonly type = PushDevice.Web;

  constructor(private swPush: SwPush) {}

  async isEnabled(): Promise<boolean> {
    return this.swPush.isEnabled;
  }

  async getPermissions(): Promise<PushPermissions> {
    return Notification.permission;
  }

  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then((permissionResult) => {
      if (permissionResult !== 'granted') {
        throw new Error('NotGrantedPushPermissionError');
      }
      return true;
    });
  }

  async getPushSubscription(): Promise<any> {
    const sub = await this.swPush.requestSubscription({
      serverPublicKey: Environment.inv().webPushPublicKey,
    });

    return sub.toJSON();
  }
}
