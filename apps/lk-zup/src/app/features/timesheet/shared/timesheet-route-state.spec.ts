import {
  createDefaultTimesheetRouteState,
  createTimesheetRouteQueryKey,
  normalizeTimesheetRouteQueryParams,
  parseTimesheetRouteState,
  serializeTimesheetRouteState,
} from './timesheet-route-state';

describe('timesheet-route-state', () => {
  const defaults = createDefaultTimesheetRouteState(
    new Date('2026-04-01T00:00:00.000Z'),
  );

  it('parses a full route state payload', () => {
    expect(
      parseTimesheetRouteState(
        {
          year: '2027',
          month: '3',
        },
        defaults,
      ),
    ).toEqual({
      year: 2027,
      month: 3,
    });
  });

  it('falls back to defaults for invalid values', () => {
    expect(
      parseTimesheetRouteState(
        {
          year: 'year',
          month: '12',
        },
        defaults,
      ),
    ).toEqual(defaults);
  });

  it('serializes only values that differ from defaults', () => {
    expect(
      serializeTimesheetRouteState(
        {
          year: 2027,
          month: 5,
        },
        defaults,
      ),
    ).toEqual({
      year: '2027',
      month: '5',
    });

    expect(
      serializeTimesheetRouteState(defaults, defaults),
    ).toEqual({});
  });

  it('normalizes current route query for loop-safe comparisons', () => {
    const state = {
      year: 2027,
      month: 3,
    };

    expect(
      normalizeTimesheetRouteQueryParams(
        {
          month: '3',
          year: '2027',
        },
        defaults,
      ),
    ).toBe(createTimesheetRouteQueryKey(state, defaults));
  });
});
