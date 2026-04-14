import {
  createDefaultVacationRouteState,
  createVacationRouteQueryKey,
  normalizeVacationRouteQueryParams,
  parseVacationRouteState,
  serializeVacationRouteState,
} from './vacations-route-state';

describe('vacations-route-state', () => {
  const defaults = createDefaultVacationRouteState(
    new Date('2026-04-01T00:00:00.000Z'),
  );

  it('parses a full route state payload', () => {
    expect(
      parseVacationRouteState(
        {
          viewType: 'year',
          year: '2027',
          month: '12',
          hasIntersection: 'true',
          employees: '  12,34,12 ,56 ',
        },
        defaults,
      ),
    ).toEqual({
      viewType: 'year',
      year: 2027,
      month: 11,
      filters: {
        hasIntersection: true,
        employees: ['12', '34', '56'],
      },
    });
  });

  it('falls back to defaults for invalid values', () => {
    expect(
      parseVacationRouteState(
        {
          viewType: 'week',
          year: 'year',
          month: '13',
          hasIntersection: 'maybe',
        },
        defaults,
      ),
    ).toEqual(defaults);
  });

  it('converts month between query params and service state', () => {
    const state = parseVacationRouteState({ month: '1' }, defaults);

    expect(state.month).toBe(0);
    expect(
      serializeVacationRouteState(
        {
          ...defaults,
          month: 0,
        },
        defaults,
      ),
    ).toEqual({ month: '1' });
  });

  it('removes empty and duplicated employees from query params', () => {
    expect(
      parseVacationRouteState(
        {
          employees: '1,, 2,1, ,3',
        },
        defaults,
      ).filters.employees,
    ).toEqual(['1', '2', '3']);
  });

  it('normalizes the current route query for loop-safe comparisons', () => {
    const state = {
      ...defaults,
      viewType: 'year' as const,
      filters: {
        hasIntersection: true,
        employees: ['44', '55'],
      },
    };

    expect(
      normalizeVacationRouteQueryParams(
        {
          employees: '55,44,55',
          hasIntersection: 'true',
          viewType: 'year',
          month: '4',
        },
        defaults,
      ),
    ).toBe(createVacationRouteQueryKey(state, defaults));
  });
});
