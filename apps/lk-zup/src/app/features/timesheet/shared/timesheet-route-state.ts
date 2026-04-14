export type TimesheetRouteState = {
  year: number;
  month: number;
};

type QueryParams = Record<string, unknown>;

export function createDefaultTimesheetRouteState(
  currentDate = new Date(),
): TimesheetRouteState {
  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  };
}

export function cloneTimesheetRouteState(
  state: TimesheetRouteState,
): TimesheetRouteState {
  return {
    year: state.year,
    month: state.month,
  };
}

export function parseTimesheetRouteState(
  queryParams: QueryParams,
  defaults = createDefaultTimesheetRouteState(),
): TimesheetRouteState {
  const year = parseYear(queryParams.year) ?? defaults.year;
  const month = parseMonth(queryParams.month) ?? defaults.month;

  return {
    year,
    month,
  };
}

export function serializeTimesheetRouteState(
  state: TimesheetRouteState,
  defaults = createDefaultTimesheetRouteState(),
): Record<string, string> {
  const normalizedState = cloneTimesheetRouteState(state);
  const queryParams: Record<string, string> = {};

  if (normalizedState.year !== defaults.year) {
    queryParams.year = normalizedState.year.toString();
  }

  if (normalizedState.month !== defaults.month) {
    queryParams.month = normalizedState.month.toString();
  }

  return queryParams;
}

export function normalizeTimesheetRouteQueryParams(
  queryParams: QueryParams,
  defaults = createDefaultTimesheetRouteState(),
): string {
  return createTimesheetRouteQueryKey(
    parseTimesheetRouteState(queryParams, defaults),
    defaults,
  );
}

export function createTimesheetRouteQueryKey(
  state: TimesheetRouteState,
  defaults = createDefaultTimesheetRouteState(),
): string {
  const queryParams = serializeTimesheetRouteState(state, defaults);

  return Object.entries(queryParams)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
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

  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 11) {
    return undefined;
  }

  return parsed;
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
