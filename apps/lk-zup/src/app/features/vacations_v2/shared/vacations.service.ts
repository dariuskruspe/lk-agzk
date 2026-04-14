import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { VacationsApiService } from './vacations-api.service';
import { VacationsInterface } from '@app/features/vacations/models/vacations.interface';
import { MemberPointTypeInterface } from './types';
import { VacationsStateInterface } from '@app/features/vacations/models/vacations-states.interface';
import { keyBy } from 'lodash';
import { VacationPeriodInterface } from '@app/features/vacations/models/vacations.interface';
import moment from 'moment';
import { VacationUtilsService } from './vacation-utils.service';
import { VacationTypeResponseInterface } from '@app/features/vacations/models/vacations-types.interface';
import { toPromise } from '@app/shared/utilits/to-promise';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import {
  cloneVacationRouteState,
  createDefaultVacationRouteState,
  VacationFilters,
  VacationRouteState,
} from './vacations-route-state';

// оптимизация, чтобы не приходилось каждый раз парсить даты
export type VacationPeriodComputed = VacationPeriodInterface & {
  startDateMoment: moment.Moment;
  endDateMoment: moment.Moment;
};
export type VacationOverlap = {
  startDate: Date;
  endDate: Date;
  employees: string[];
};

export type VacationItemComputed = Omit<VacationsInterface, 'periods'> & {
  periods: VacationPeriodComputed[];
  overlaps: VacationOverlap[];
  fullName?: string;
  isCurrentUser?: boolean;
  isManager?: boolean; // Является ли руководителем текущего пользователя
};

@Injectable({
  providedIn: 'root',
})
export class VacationsService {
  private api = inject(VacationsApiService);
  private utils = inject(VacationUtilsService);
  private userFacade = inject(MainCurrentUserFacade);

  /** Режим отображения: 'vacationSchedule' для личного графика, 'employeesVacations' для управления отпусками сотрудников */
  sectionId = signal<'vacationSchedule' | 'employeesVacations'>('vacationSchedule');
  routeDefaults = createDefaultVacationRouteState();
  initialized = signal(false);

  viewType = signal<'year' | 'month'>('month');

  year = signal(new Date().getFullYear());
  month = signal(new Date().getMonth());

  fullMonth = computed<[number, number]>(() => [this.year(), this.month()]);

  loading = signal(false);

  loadingData = signal(false);
  hasLoadedData = signal(false);

  vacations = signal<VacationItemComputed[]>([]);
  statusTypes = signal<MemberPointTypeInterface[]>([]);
  states = signal<VacationsStateInterface[]>([]);
  vacationTypes = signal<VacationTypeResponseInterface[]>([]);

  // ID руководителя текущего пользователя
  managerEmployeeId = signal<string | null>(null);

  statesMap = computed(() => keyBy(this.states(), 'id'));
  statusTypesMap = computed(() => keyBy(this.statusTypes(), 'id'));

  vacationStatusTypes = computed(() =>
    this.statusTypes().filter((i) => i.showGroup.includes('vacationSchedule')),
  );

  /** Флаг фильтрации: показать только отпуска, ожидающие согласования */
  showOnlyForApproval = signal(false);

  filters = signal<VacationFilters>({
    hasIntersection: false,
    employees: [],
  });

  /** Количество сотрудников с отпусками, ожидающими согласования */
  toBeApprovedCount = computed(() => {
    return this.vacations().filter((v) =>
      v.periods.some((period) => !period.approved && period.activeApprovement),
    ).length;
  });

  filteredVacations = computed(() => {
    let vacations = this.vacations();
    const { hasIntersection, employees } = this.filters();

    // Фильтрация по табу "К согласованию"
    if (this.showOnlyForApproval()) {
      vacations = vacations.filter((v) =>
        v.periods.some(
          (period) => !period.approved && period.activeApprovement,
        ),
      );
    }

    if (employees.length) {
      vacations = vacations.filter((vacation) =>
        employees.includes(vacation.employeeId),
      );
    }

    if (hasIntersection) {
      if (this.viewType() === 'month') {
        const [year, month] = this.fullMonth();
        const startOfMonth = moment().year(year).month(month).startOf('month');
        const endOfMonth = moment().year(year).month(month).endOf('month');

        vacations = vacations.filter((vacation) =>
          vacation.overlaps.some((overlap) => {
            const overlapStart = moment(overlap.startDate).startOf('day');
            const overlapEnd = moment(overlap.endDate).endOf('day');

            return (
              overlapStart.isSameOrBefore(endOfMonth) &&
              overlapEnd.isSameOrAfter(startOfMonth)
            );
          }),
        );
      } else {
        vacations = vacations.filter(
          (vacation) => vacation.overlaps.length > 0,
        );
      }
    }

    return vacations;
  });

  private abortController = new AbortController();

  constructor() {
    effect(() => {
      if (!this.initialized()) {
        return;
      }

      this.year();
      this.sectionId();

      if (!this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      void this.load();
    });

    effect(() => {
      if (!this.initialized() || !this.hasLoadedData()) {
        return;
      }

      const validEmployeeIds = new Set(
        this.vacations().map((vacation) => vacation.employeeId),
      );
      const filters = this.filters();
      const employees = filters.employees.filter((employeeId) =>
        validEmployeeIds.has(employeeId),
      );

      if (employees.length === filters.employees.length) {
        return;
      }

      this.filters.set({
        ...filters,
        employees,
      });
    });
  }

  private async load() {
    // если данные уже загружены один раз, то обновляем только отпуска
    if (this.statusTypes()?.length) {
      return this.loadData();
    }

    this.loading.set(true);

    try {
      // Загружаем профиль текущего пользователя для получения ID руководителя
      await this.loadCurrentUserProfile();

      const [vacations, statusTypes, states, vacationTypes] = await Promise.all(
        [
          this.loadData(),
          this.loadStatusTypes(),
          this.loadVacationStates(),
          this.loadVacationTypes(),
        ],
      );
      this.statusTypes.set(statusTypes);
      this.states.set(states);
      this.vacationTypes.set(vacationTypes.vacationTypes);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadData() {
    this.loadingData.set(true);
    this.hasLoadedData.set(false);
    try {
      const vacations = await this.loadVacations(this.year());
      const overlaps = this.utils.computeOverlaps(vacations);
      const currentUser = this.userFacade.getData();
      const currentUserEmployeeIds =
        currentUser?.employees?.map((e) => e.employeeID) || [];

      this.vacations.set(
        vacations.map((vacation) => {
          const periods = vacation.periods.map((period) => ({
            ...period,
            startDateMoment: moment(period.startDate).startOf('day'),
            endDateMoment: moment(period.endDate).endOf('day'),
          }));

          // Фильтруем пересечения: только те, которые относятся к периодам этого сотрудника
          const relevantOverlaps = overlaps.filter((overlap) => {
            // Должно быть больше одного сотрудника и текущий сотрудник в списке
            if (
              overlap.employees.length <= 1 ||
              !overlap.employees.includes(vacation.employeeId)
            ) {
              return false;
            }

            // Проверяем, что пересечение действительно пересекается с периодами этого сотрудника
            return periods.some((period) => {
              const periodStart = new Date(period.startDate).getTime();
              const periodEnd = new Date(period.endDate).getTime();
              const overlapStart = new Date(overlap.startDate).getTime();
              const overlapEnd = new Date(overlap.endDate).getTime();

              // Пересечение есть, если интервалы накладываются
              return overlapStart <= periodEnd && overlapEnd >= periodStart;
            });
          });

          // Определяем, является ли сотрудник текущим пользователем
          const isCurrentUser = currentUserEmployeeIds.includes(
            vacation.employeeId,
          );

          // Определяем, является ли сотрудник руководителем текущего пользователя
          const managerEmployeeId = this.managerEmployeeId();
          const isManager =
            !!managerEmployeeId && vacation.employeeId === managerEmployeeId;

          return {
            ...vacation,
            name: this.utils.getShortName(vacation.name),
            fullName: vacation.name,
            periods,
            overlaps: relevantOverlaps,
            isCurrentUser,
            isManager,
          };
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingData.set(false);
      this.hasLoadedData.set(true);
    }
  }

  private async loadVacations(year: number): Promise<VacationsInterface[]> {
    const isManagement = this.sectionId() === 'employeesVacations';

    const vacationsPromise = toPromise(
      this.api.getVacationPeriods({
        year,
        subordinates: isManagement,
        sectionId: this.sectionId(),
      }),
      this.abortController.signal,
    );

    if (!isManagement) {
      return vacationsPromise;
    }

    // Для management-режима: загружаем members параллельно и обогащаем данные
    const [vacations, members] = await Promise.all([
      vacationsPromise,
      toPromise(
        this.api.getMembers(this.sectionId()),
        this.abortController.signal,
      ),
    ]);

    // Фильтруем: оставляем только подчинённых сотрудников
    const filteredVacations = vacations.filter((v) =>
      members.some((m) => m.id === v.employeeId && m.subordinate),
    );

    // Обогащаем данные флагами subordinated и approvingAllowed
    return filteredVacations.map((vacation) => {
      const member = members.find((m) => m.id === vacation.employeeId);
      return {
        ...vacation,
        subordinated: member?.subordinate ?? false,
        approvingAllowed: member?.approvingAllowed ?? false,
      };
    });
  }

  private loadStatusTypes() {
    return toPromise(this.api.getStatusTypes(), this.abortController.signal);
  }

  private async loadVacationStates() {
    const response = await toPromise(
      this.api.getVacationStates(),
      this.abortController.signal,
    );
    return response.states;
  }

  private loadVacationTypes() {
    return toPromise(this.api.getVacationTypes(), this.abortController.signal);
  }

  /**
   * Загружает профиль текущего пользователя для получения ID руководителя
   */
  private async loadCurrentUserProfile() {
    try {
      const currentUser = this.userFacade.getData();
      if (!currentUser?.employees?.length) {
        return;
      }

      // Берём первый employeeID текущего пользователя
      const currentEmployeeId = currentUser.employees[0].employeeID;
      const profile = await toPromise(
        this.api.getEmployeeProfile(currentEmployeeId),
        this.abortController.signal,
      );

      if (profile?.approverEmployeeID) {
        this.managerEmployeeId.set(profile.approverEmployeeID);
      }
    } catch (error) {
      console.error('Error loading current user profile:', error);
    }
  }

  setFullMonth(fullMonth: [number, number]) {
    this.year.set(fullMonth[0]);
    this.month.set(fullMonth[1]);
  }

  initializeRouteState(state: VacationRouteState) {
    const nextState = cloneVacationRouteState(state);

    this.initialized.set(false);
    this.viewType.set(nextState.viewType);
    this.year.set(nextState.year);
    this.month.set(nextState.month);
    this.filters.set(nextState.filters);
    this.initialized.set(true);
  }

  pauseRouteState() {
    this.initialized.set(false);
  }

  getRouteState(): VacationRouteState {
    return {
      viewType: this.viewType(),
      year: this.year(),
      month: this.month(),
      filters: {
        hasIntersection: this.filters().hasIntersection,
        employees: [...this.filters().employees],
      },
    };
  }

  getDefaultRouteState(): VacationRouteState {
    return cloneVacationRouteState(this.routeDefaults);
  }

  /** Перезагрузить данные отпусков (после согласования/отклонения) */
  async reload(): Promise<void> {
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    await this.loadData();
  }
}
