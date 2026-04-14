import { DockyMessage } from './types';

export const DOCKY_V2_MOCK_MESSAGES: DockyMessage[] = [
  {
    id: 'mock-human-1',
    type: 'human',
    text: 'Покажи баланс отпусков на этот год',
  },
  {
    id: 'mock-tool-1',
    type: 'tool_call',
    pending: false,
    tool: {
      name: 'get_vacation_balance_by_date',
      title: 'Получаю баланс отпусков',
    },
    args: [{ employeeId: 'current', year: 2026 }],
  },
  {
    id: 'mock-agent-1',
    type: 'agent',
    agentName: 'vacations',
    text: 'По мок-данным доступно 18 дней отпуска на 2026 год.',
    pending: false,
  },
  {
    id: 'mock-human-2',
    type: 'human',
    text: 'Тогда оформи отпуск с 10 марта на 5 дней',
  },
  {
    id: 'mock-tool-2',
    type: 'tool_call',
    pending: true,
    tool: {
      name: 'vacation_create',
      title: 'Создаю заявку на отпуск',
    },
    args: [{ startDate: '2026-03-10', days: 5 }],
  },
  {
    id: 'mock-agent-2',
    type: 'agent',
    agentName: 'vacations',
    text: '',
    pending: true,
  },
];
