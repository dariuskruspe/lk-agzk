import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { BusinessTripApiService } from './business-trip-api.service';
import { VacationsInterface } from '@app/features/vacations/models/vacations.interface';
import { MemberPointTypeInterface } from '@app/features/vacations_v2/shared/types';
import { keyBy } from 'lodash';
import { VacationPeriodInterface } from '@app/features/vacations/models/vacations.interface';
import moment from 'moment';
import { VacationUtilsService } from '@app/features/vacations_v2/shared/vacation-utils.service';
import { toPromise } from '@app/shared/utilits/to-promise';
import { MainCurrentUserFacade } from '@app/features/main/facades/main-current-user.facade';
import { BusinessTripsMemberListItem } from '@app/features/business-trips/constants/business-trip-data-config';

export type BusinessTripItemComputed = Omit<VacationsInterface, 'periods'> & {
  periods: BusinessTripPeriodComputed[];
  overlaps: BusinessTripOverlap[];
  fullName?: string;
  isCurrentUser?: boolean;
};

export type BusinessTripPeriodComputed = VacationPeriodInterface & {
  startDateMoment: moment.Moment;
  endDateMoment: moment.Moment;
};

export type BusinessTripOverlap = {
  startDate: Date;
  endDate: Date;
  employees: string[];
};

export type BusinessTripFilters = {
  hasIntersection: boolean;
  employees: string[];
};

@Injectable({
  providedIn: 'root',
})
export class BusinessTripService {
  private api = inject(BusinessTripApiService);
  private utils = inject(VacationUtilsService);
  private userFacade = inject(MainCurrentUserFacade);
  private active = signal(false);

  /** Режим отображения: 'businessTrips' для основной страницы */
  sectionId = signal<'businessTrips' | 'employeeBusinessTrips'>('businessTrips');

  viewType = signal<'year' | 'month'>('month');

  year = signal(new Date().getFullYear());
  month = signal(new Date().getMonth());

  fullMonth = computed<[number, number]>(() => [this.year(), this.month()]);

  loading = signal(false);
  loadingData = signal(false);

  trips = signal<BusinessTripItemComputed[]>([]);
  statusTypes = signal<MemberPointTypeInterface[]>([]);

  statusTypesMap = computed(() => keyBy(this.statusTypes(), 'id'));

  tripStatusTypes = computed(() =>
    this.statusTypes().filter((i) => i.showGroup.includes('businessTrips')),
  );

  filters = signal<BusinessTripFilters>({
    hasIntersection: false,
    employees: [],
  });

  filteredTrips = computed(() => {
    let trips = this.trips();
    const { hasIntersection, employees } = this.filters();

    if (employees.length) {
      trips = trips.filter((trip) => employees.includes(trip.employeeId));
    }

    if (hasIntersection) {
      if (this.viewType() === 'month') {
        const [year, month] = this.fullMonth();
        const startOfMonth = moment().year(year).month(month).startOf('month');
        const endOfMonth = moment().year(year).month(month).endOf('month');

        trips = trips.filter((trip) =>
          trip.overlaps.some((overlap) => {
            const overlapStart = moment(overlap.startDate).startOf('day');
            const overlapEnd = moment(overlap.endDate).endOf('day');

            return (
              overlapStart.isSameOrBefore(endOfMonth) &&
              overlapEnd.isSameOrAfter(startOfMonth)
            );
          }),
        );
      } else {
        trips = trips.filter((trip) => trip.overlaps.length > 0);
      }
    }

    return trips;
  });

  private abortController = new AbortController();

  constructor() {
    effect(() => {
      if (!this.active()) {
        return;
      }

      const year = this.year();
      const sectionId = this.sectionId();

      if (!this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      void this.load();
    });
  }

  private async load() {
    if (this.statusTypes()?.length) {
      return this.loadData();
    }

    this.loading.set(true);

    try {
      const [trips, statusTypes] = await Promise.all([
        this.loadData(),
        this.loadStatusTypes(),
      ]);
      this.statusTypes.set(statusTypes);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadData() {
    this.loadingData.set(true);
    try {
      const year = this.year();
      const trips = await this.loadTrips(year);
      const overlaps = this.computeOverlaps(trips);
      const currentUser = this.userFacade.getData();
      const currentUserEmployeeIds =
        currentUser?.employees?.map((e) => e.employeeID) || [];

      this.trips.set(
        trips.map((trip) => {
          const periods = trip.periods.map((period) => ({
            ...period,
            startDateMoment: moment(period.startDate).startOf('day'),
            endDateMoment: moment(period.endDate).endOf('day'),
          }));

          const relevantOverlaps = overlaps.filter((overlap) => {
            if (
              overlap.employees.length <= 1 ||
              !overlap.employees.includes(trip.employeeId)
            ) {
              return false;
            }

            return periods.some((period) => {
              const periodStart = new Date(period.startDate).getTime();
              const periodEnd = new Date(period.endDate).getTime();
              const overlapStart = new Date(overlap.startDate).getTime();
              const overlapEnd = new Date(overlap.endDate).getTime();

              return overlapStart <= periodEnd && overlapEnd >= periodStart;
            });
          });

          const isCurrentUser = currentUserEmployeeIds.includes(trip.employeeId);

          return {
            ...trip,
            name: this.utils.getShortName(trip.name),
            fullName: trip.name,
            periods,
            overlaps: relevantOverlaps,
            isCurrentUser,
          };
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingData.set(false);
    }
  }

  private async loadTrips(year: number): Promise<VacationsInterface[]> {
    const dateBegin = new Date(year, 0, 1).toISOString();
    const dateEnd = new Date(year, 11, 31).toISOString();

    const tripsPromise = toPromise(
      this.api.getTrips({
        dateBegin,
        dateEnd,
        sectionId: this.sectionId(),
      }),
      this.abortController.signal,
    );

    const isEmployeeTrips = this.sectionId() === 'employeeBusinessTrips';

    if (!isEmployeeTrips) {
      return tripsPromise;
    }

    // Для employeeBusinessTrips: загружаем members и фильтруем
    const [trips, members] = await Promise.all([
      tripsPromise,
      toPromise(
        this.api.getMembers(this.sectionId()),
        this.abortController.signal,
      ),
    ]);

    // Фильтруем: оставляем только подчинённых сотрудников
    const filteredTrips = trips.filter((t) =>
      members.some((m) => m.id === t.employeeId && m.subordinate),
    );

    // Обогащаем данные флагами subordinated и approvingAllowed
    return filteredTrips.map((trip) => {
      const member = members.find((m) => m.id === trip.employeeId);
      return {
        ...trip,
        subordinated: member?.subordinate ?? false,
        approvingAllowed: member?.approvingAllowed ?? false,
      };
    });
  }

  private loadStatusTypes() {
    return toPromise(this.api.getStatusTypes(), this.abortController.signal);
  }

  private computeOverlaps(trips: VacationsInterface[]): BusinessTripOverlap[] {
    const allPeriods: {
      employeeId: string;
      start: Date;
      end: Date;
    }[] = [];

    trips.forEach((trip) => {
      trip.periods.forEach((period) => {
        allPeriods.push({
          employeeId: trip.employeeId,
          start: new Date(period.startDate),
          end: new Date(period.endDate),
        });
      });
    });

    const overlaps: BusinessTripOverlap[] = [];

    for (let i = 0; i < allPeriods.length; i++) {
      for (let j = i + 1; j < allPeriods.length; j++) {
        const a = allPeriods[i];
        const b = allPeriods[j];

        if (a.employeeId === b.employeeId) continue;

        const overlapStart = new Date(Math.max(a.start.getTime(), b.start.getTime()));
        const overlapEnd = new Date(Math.min(a.end.getTime(), b.end.getTime()));

        if (overlapStart <= overlapEnd) {
          const existingOverlap = overlaps.find(
            (o) =>
              o.startDate.getTime() === overlapStart.getTime() &&
              o.endDate.getTime() === overlapEnd.getTime(),
          );

          if (existingOverlap) {
            if (!existingOverlap.employees.includes(a.employeeId)) {
              existingOverlap.employees.push(a.employeeId);
            }
            if (!existingOverlap.employees.includes(b.employeeId)) {
              existingOverlap.employees.push(b.employeeId);
            }
          } else {
            overlaps.push({
              startDate: overlapStart,
              endDate: overlapEnd,
              employees: [a.employeeId, b.employeeId],
            });
          }
        }
      }
    }

    return overlaps;
  }

  setFullMonth(fullMonth: [number, number]) {
    this.year.set(fullMonth[0]);
    this.month.set(fullMonth[1]);
  }

  enter(sectionId: 'businessTrips' | 'employeeBusinessTrips') {
    this.sectionId.set(sectionId);

    if (this.statusTypes().length) {
      this.loadingData.set(true);
    } else {
      this.loading.set(true);
    }

    this.active.set(true);
  }

  leave(defaultSectionId: 'businessTrips' | 'employeeBusinessTrips' = 'businessTrips') {
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.active.set(false);
    this.loading.set(false);
    this.loadingData.set(false);
    this.sectionId.set(defaultSectionId);
  }

  async reload(): Promise<void> {
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    await this.loadData();
  }
}
