import { Observable } from 'rxjs';
import {
  DockyMessage,
  DockyMessageAgent,
  DockyMessageHuman,
  DockyMessageToolCall,
} from './types';

export class DockyBotMock {
  private idCounter = 0;

  // messages with last message is human message
  stream(messages: DockyMessage[]): Observable<DockyMessage[]> {
    const history = [...messages];
    const prompt = this.getLastHumanMessage(history);
    const scenario = this.getScenario(prompt?.text ?? '');

    return new Observable<DockyMessage[]>((subscriber) => {
      let current = history;
      const timers: Array<ReturnType<typeof setTimeout>> = [];

      const emit = () => subscriber.next(current);
      const schedule = (delayMs: number, action: () => void) => {
        timers.push(setTimeout(action, delayMs));
      };

      const typingMessageId = this.createMessageId('agent');
      const toolMessageId = this.createMessageId('tool');

      const typingMessage: DockyMessageAgent = {
        id: typingMessageId,
        type: 'agent',
        agentName: scenario.agentId,
        text: '',
        pending: true,
      };

      current = [...current, typingMessage];
      emit();

      schedule(700, () => {
        const toolCall: DockyMessageToolCall = {
          id: toolMessageId,
          type: 'tool_call',
          pending: true,
          args: scenario.toolArgs,
          tool: {
            name: scenario.toolName,
            title: scenario.toolTitle,
          },
        };

        current = [...current, toolCall];
        emit();
      });

      schedule(1600, () => {
        current = current.map((message) => {
          if (message.type !== 'tool_call' || message.id !== toolMessageId) {
            return message;
          }

          return { ...message, pending: false };
        });
        emit();
      });

      schedule(2400, () => {
        current = current.map((message) => {
          if (message.type !== 'agent' || message.id !== typingMessageId) {
            return message;
          }

          return {
            ...message,
            text: scenario.answer,
            pending: false,
          };
        });

        emit();
        subscriber.complete();
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    });
  }

  private getLastHumanMessage(
    messages: DockyMessage[],
  ): DockyMessageHuman | null {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (message.type === 'human') {
        return message;
      }
    }

    return null;
  }

  private getScenario(prompt: string): {
    agentId: string;
    toolName: string;
    toolTitle: string;
    toolArgs: unknown[];
    answer: string;
  } {
    const normalizedPrompt = prompt.toLowerCase();

    if (normalizedPrompt.includes('отпуск')) {
      return {
        agentId: 'vacations',
        toolName: 'vacation_info',
        toolTitle: 'Проверяю баланс и правила отпуска',
        toolArgs: [{ employeeId: 'current' }],
        answer:
          'Нашел данные по отпускам. Это моковый ответ docky-v2: могу показать баланс дней и собрать заявку по выбранным датам.',
      };
    }

    if (
      normalizedPrompt.includes('зарплат') ||
      normalizedPrompt.includes('выплат')
    ) {
      return {
        agentId: 'salary',
        toolName: 'salary_summary',
        toolTitle: 'Собираю данные о начислениях',
        toolArgs: [{ period: 'last_month' }],
        answer:
          'Подготовил сводку по зарплате. Это моковый ответ docky-v2: здесь можно показать последние начисления и дату ближайшей выплаты.',
      };
    }

    return {
      agentId: 'requests',
      toolName: 'create_issue',
      toolTitle: 'Проверяю шаблон заявки',
      toolArgs: [{ issueType: 'generic_request' }],
      answer:
        'Сценарий заявок готов. Это моковый ответ docky-v2: следующий шаг может быть подтверждение полей и отправка заявки.',
    };
  }

  private createMessageId(prefix: string): string {
    this.idCounter += 1;
    return `${prefix}-${Date.now()}-${this.idCounter}`;
  }
}
