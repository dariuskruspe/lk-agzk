export type VacationViewType = 'year' | 'month';

export type VacationFilters = {
  hasIntersection: boolean;
  employees: string[];
};

export type VacationRouteState = {
  viewType: VacationViewType;
  year: number;
  month: number;
  filters: VacationFilters;
};

type QueryParams = Record<string, unknown>;

const VALID_VIEW_TYPES: VacationViewType[] = ['year', 'month'];

export function createDefaultVacationFilters(): VacationFilters {
  return {
    hasIntersection: false,
    employees: [],
  };
}

export function createDefaultVacationRouteState(
  currentDate = new Date(),
): VacationRouteState {
  return {
    viewType: 'month',
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    filters: createDefaultVacationFilters(),
  };
}

export function cloneVacationRouteState(
  state: VacationRouteState,
): VacationRouteState {
  return {
    viewType: state.viewType,
    year: state.year,
    month: state.month,
    filters: {
      hasIntersection: state.filters.hasIntersection,
      employees: [...state.filters.employees],
    },
  };
}

export function parseVacationRouteState(
  queryParams: QueryParams,
  defaults = createDefaultVacationRouteState(),
): VacationRouteState {
  const viewType = parseViewType(queryParams.viewType) ?? defaults.viewType;
  const year = parseYear(queryParams.year) ?? defaults.year;
  const month = parseMonth(queryParams.month) ?? defaults.month;
  const hasIntersection =
    parseBoolean(queryParams.hasIntersection) ??
    defaults.filters.hasIntersection;
  const employees = hasOwnQueryParam(queryParams, 'employees')
    ? parseEmployees(queryParams.employees)
    : [...defaults.filters.employees];

  return {
    viewType,
    year,
    month,
    filters: {
      hasIntersection,
      employees,
    },
  };
}

export function serializeVacationRouteState(
  state: VacationRouteState,
  defaults = createDefaultVacationRouteState(),
): Record<string, string> {
  const normalizedState = cloneVacationRouteState(state);
  normalizedState.filters.employees = dedupeEmployees(
    normalizedState.filters.employees,
  );

  const queryParams: Record<string, string> = {};

  if (normalizedState.viewType !== defaults.viewType) {
    queryParams.viewType = normalizedState.viewType;
  }

  if (normalizedState.year !== defaults.year) {
    queryParams.year = normalizedState.year.toString();
  }

  if (normalizedState.month !== defaults.month) {
    queryParams.month = (normalizedState.month + 1).toString();
  }

  if (normalizedState.filters.hasIntersection) {
    queryParams.hasIntersection = 'true';
  }

  if (normalizedState.filters.employees.length) {
    queryParams.employees = normalizedState.filters.employees.join(',');
  }

  return queryParams;
}

export function normalizeVacationRouteQueryParams(
  queryParams: QueryParams,
  defaults = createDefaultVacationRouteState(),
): string {
  return createVacationRouteQueryKey(
    parseVacationRouteState(queryParams, defaults),
    defaults,
  );
}

export function createVacationRouteQueryKey(
  state: VacationRouteState,
  defaults = createDefaultVacationRouteState(),
): string {
  const queryParams = serializeVacationRouteState(state, defaults);

  return Object.entries(queryParams)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function hasOwnQueryParam(
  queryParams: QueryParams,
  key: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(queryParams, key);
}

function parseViewType(value: unknown): VacationViewType | undefined {
  const queryValue = getQueryParamValue(value);

  if (!queryValue || !VALID_VIEW_TYPES.includes(queryValue as VacationViewType)) {
    return undefined;
  }

  return queryValue as VacationViewType;
}

function parseYear(value: unknown): number | undefined {
  const queryValue = getQueryParamValue(value);

  if (!queryValue) {
    return undefined;
  }

  const parsed = Number.parseInt(queryValue, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function parseMonth(value: unknown): number | undefined {
  const queryValue = getQueryParamValue(value);

  if (!queryValue) {
    return undefined;
  }

  const parsed = Number.parseInt(queryValue, 10);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) {
    return undefined;
  }

  return parsed - 1;
}

function parseBoolean(value: unknown): boolean | undefined {
  const queryValue = getQueryParamValue(value);

  if (queryValue === 'true') {
    return true;
  }

  if (queryValue === 'false') {
    return false;
  }

  return undefined;
}

function parseEmployees(value: unknown): string[] {
  const queryValue = getQueryParamValue(value);

  if (!queryValue) {
    return [];
  }

  return dedupeEmployees(queryValue.split(','));
}

function dedupeEmployees(employees: string[]): string[] {
  return Array.from(
    new Set(
      employees
        .map((employee) => employee.trim())
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

function getQueryParamValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return getQueryParamValue(value[0]);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  return value;
}
