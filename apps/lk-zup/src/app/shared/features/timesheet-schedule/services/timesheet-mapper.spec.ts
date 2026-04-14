import { TimesheetScheduleDayType } from '../models/timesheet-schedule.interface';
import { TimesheetMapper } from './timesheet-mapper';

describe('TimesheetMapper', () => {
  const mapper = new TimesheetMapper();

  it('should use custom hex color and generate a light background color', () => {
    const style = mapper.mapDayStyles(
      createDayType({
        color: '#FF77AA',
        timeType: 'Отпуск',
      }),
    );

    expect(style.color).toBe('#FF77AA');
    expect(style.bgColor).toBe('#FFE1EC');
  });

  it('should normalize short hex color before generating styles', () => {
    const style = mapper.mapDayStyles(
      createDayType({
        color: '#F7A',
        timeType: '',
      }),
    );

    expect(style.color).toBe('#FF77AA');
    expect(style.bgColor).toBe('#FFE1EC');
  });

  it('should keep fallback colors when custom color is empty', () => {
    const style = mapper.mapDayStyles(
      createDayType({
        color: '',
        timeType: 'Отпуск',
      }),
    );

    expect(style.color).toBe('#3880FF');
    expect(style.bgColor).toBe('#EDF1FD');
  });

  it.each(['rgba(255, 119, 170, 1)', 'not-a-color'])(
    'should keep fallback colors when custom color is %s',
    (color) => {
      const style = mapper.mapDayStyles(
        createDayType({
          color,
          timeType: 'Больничный',
        }),
      );

      expect(style.color).toBe('rgba(255, 119, 170, 1)');
      expect(style.bgColor).toBe('rgba(255, 235, 243, 1)');
    },
  );
});

function createDayType(
  overrides: Partial<TimesheetScheduleDayType> = {},
): TimesheetScheduleDayType {
  return {
    name: 'Рабочий день',
    color: '',
    iconName: '',
    issueId: '',
    stateId: '',
    code: '',
    onApproval: false,
    hoursCountActual: 8,
    hoursCountPlan: 8,
    hoursCountDifference: 0,
    timeType: 'Рабочий день',
    calendarType: 'fact',
    ...overrides,
  };
}
