import { computed, inject, Injectable, signal } from '@angular/core';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { UserService } from '@shared/services/user.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userService = inject(UserService);

  private localStorageService = inject(LocalStorageService);

  current = signal<MainCurrentUserInterface>(null);

  activeEmployeeId = signal<string>(null);

  activeEmployee = computed(() => {
    const current = this.current();
    const activeEmployeeId = this.activeEmployeeId();

    if (!current || !activeEmployeeId) {
      return null;
    }

    return current.employees.find((i) => i.employeeID === activeEmployeeId);
  });

  async loadOnce() {
    if (this.current()) {
      return;
    }

    const currentUser = await firstValueFrom(this.userService.getCurrentUser());

    const employeeId: string = this.localStorageService.getCurrentEmployeeId();
    const hasCurrentEmployeeId: boolean = currentUser.employees.some(
      (e) => e.employeeID === employeeId,
    );

    if (!employeeId || !hasCurrentEmployeeId) {
      this.localStorageService.setCurrentEmployeeId(
        currentUser.employees[0].employeeID,
      );
    }

    this.current.set(currentUser);
    this.activeEmployeeId.set(this.localStorageService.getCurrentEmployeeId());
  }

  getLang(): string {
    return this.localStorageService.getCurrentLang();
  }

  setActiveEmployeeId(employeeId: string) {
    this.activeEmployeeId.set(employeeId);
    this.localStorageService.setCurrentEmployeeId(employeeId);
    setTimeout(() => {
      window.location.reload();
    });
  }
  
}
