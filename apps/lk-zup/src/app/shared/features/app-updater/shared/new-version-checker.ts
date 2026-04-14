import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { logDebug, logError } from '@shared/utilits/logger';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class NewVersionCheckerService {
  private isNewVersionAvailableSubj = new BehaviorSubject<boolean>(false);

  readonly isNewVersionAvailable$ =
    this.isNewVersionAvailableSubj.asObservable();

  intervalSource: Observable<number>;

  intervalSubscription: Subscription;

  constructor(private swUpdate: SwUpdate, private zone: NgZone) {}

  async checkForUpdate(checkIntervalSeconds: number) {
    this.intervalSubscription?.unsubscribe();
    if (!this.swUpdate.isEnabled) {
      return;
    }

    await this.check();
    this.intervalSource = interval(checkIntervalSeconds * 1000);

    this.zone.runOutsideAngular(() => {
      this.intervalSubscription = this.intervalSource.subscribe(async () => {
        await this.check();
      });
    });
  }

  private async check() {
    try {
      this.isNewVersionAvailableSubj.next(await this.swUpdate.checkForUpdate());
      logDebug(
        this.isNewVersionAvailableSubj.value
          ? 'A new version is available.'
          : 'Already on the latest version.'
      );
    } catch (error) {
      logError(error, 'Failed to check for updates:');
    }
  }

  applyUpdate(): void {
    // Reload the page to update to the latest version after the new version is activated
    this.swUpdate
      .activateUpdate()
      .then(() => document.location.reload())
      .catch((error) => logError(error, 'Failed to apply updates:'));
  }
}
