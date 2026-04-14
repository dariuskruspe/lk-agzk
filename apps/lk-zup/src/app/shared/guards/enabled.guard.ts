import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EnabledGuard {
  constructor(
    private router: Router,
    private localstorageService: LocalStorageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      !!this.localstorageService.getSettings() &&
      !!this.localstorageService.getUserSettings()
    ) {
      return this.canActivateRoute(state.url);
    }
    return true;
  }

  canActivateRoute(url: string) {
    const routeSplit = url.split('/');
    // if (routeSplit.includes('timesheet')) {
    //   return this.timesheetCheck(routeSplit);
    // }
    // мб вернуть позже проверку когда на бекенде доделают настройки
    if (routeSplit.includes('issues') && routeSplit.includes('list')) {
      return this.secondCheck('issues');
    }
    if (routeSplit.includes('vacations')) {
      return this.thirdCheck('vacationSchedule');
    }
    if (routeSplit.includes('salaries')) {
      return this.thirdCheck('payroll');
    }
    if (routeSplit.includes('my-insurance')) {
      return this.thirdCheck('insurance');
    }
    if (routeSplit.includes('business-trip')) {
      return this.thirdCheck('businessTrips');
    }
    if (routeSplit.includes('employees')) {
      return this.thirdCheck('employees');
    }
    if (routeSplit.includes('issues-management')) {
      return this.secondCheck('employeeRequests');
    }
    if (routeSplit.includes('documents')) {
      return this.secondCheck('managerDocuments');
    }
    if (routeSplit.includes('hr-presentation')) {
      return this.secondCheck('presentation');
    }
    if (routeSplit.includes('vacations-employee')) {
      return this.secondCheck('employeesVacations');
    }
    if (routeSplit.includes('employee-business-trip')) {
      return this.onlySectionSettingsCheck('employeeBusinessTrips');
    }
    if (routeSplit.includes('my-documents')) {
      return this.firstCheck('myDocuments');
    }
    if (routeSplit.includes('users') && routeSplit.includes('settings')) {
      return this.enableUserSettings();
    }
    if (
      routeSplit.includes('users') &&
      routeSplit.includes('profile') &&
      routeSplit.includes('password')
    ) {
      return this.enableChangePassword();
    }
    if (
      routeSplit.includes('users') &&
      routeSplit.includes('profile') &&
      routeSplit.includes('signature')
    ) {
      return this.enableElectronicSignature();
    }
    if (
      routeSplit.includes('users') &&
      routeSplit.includes('profile') &&
      routeSplit.includes('magic-link')
    ) {
      return this.enableMagicLink();
    }
    if (routeSplit.includes('support')) {
      return this.secondCheck('support');
    }
    return true;
  }

  firstCheck(tabName: string) {
    if (this.localstorageService.getSettings()[tabName].enable) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  secondCheck(tabName: string) {
    if (
      this.localstorageService.getSettings() &&
      this.localstorageService.getSettings()[tabName].enable &&
      this.localstorageService.getUserSettings() &&
      this.localstorageService.getUserSettings()[tabName].enable
    ) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  thirdCheck(tabName: string) {
    if (
      this.localstorageService.getSettings() &&
      this.localstorageService.getSettings()[tabName].enable &&
      this.localstorageService.getUserSettings() &&
      this.localstorageService.getUserSettings()[tabName].enable &&
      !this.localstorageService.getHasUnsignedDocuments()
    ) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  fourthCheck() {
    if (!this.localstorageService.getHasUnsignedDocuments()) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  onlySectionSettingsCheck(tabName: string) {
    if (this.localstorageService.getUserSettings()[tabName].enable) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  enableChangePassword() {
    if (
      this.localstorageService.getSettings().userProfile.changePassword.enable
    ) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  enableElectronicSignature() {
    if (
      this.localstorageService.getSettings().userProfile.electronicSignature
        .enable
    ) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  enableMagicLink() {
    if (this.localstorageService.getSettings().userProfile.useMagicLink) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  enableUserSettings() {
    if (this.localstorageService.getSettings().userProfile.appSettings.enable) {
      return true;
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  private timesheetCheck(routeSplit: string[]) {
    if (routeSplit.includes('my')) {
      return this.timesheetSectionCheck('myTimesheet');
    }
    if (routeSplit.includes('team')) {
      return this.timesheetSectionCheck('teamTimesheet');
    }
    return new RedirectCommand(this.router.parseUrl('/temp-reload'));
  }

  private timesheetSectionCheck(tabName: 'myTimesheet' | 'teamTimesheet') {
    const settings = this.localstorageService.getSettings();
    const userSettings = this.localstorageService.getUserSettings();
    const settingsEnabled = settings?.[tabName]?.enable;

    if (!settingsEnabled) {
      return new RedirectCommand(this.router.parseUrl('/temp-reload'));
    }

    const userSettingsItem = userSettings?.[tabName];
    if (userSettingsItem && !userSettingsItem.enable) {
      return new RedirectCommand(this.router.parseUrl('/temp-reload'));
    }

    return true;
  }
}
