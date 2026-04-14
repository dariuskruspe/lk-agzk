import { inject, Injectable } from '@angular/core';
import {
  DockyMessage,
  DockyMessageAgent,
  DockyMessageHuman,
  DockyMessageToolCall,
} from './types';
import {
  AiService,
  AiServiceStaticResponse,
} from '../../../services/ai-service';
import { SessionService } from '@app/shared/services/session.service';
import { MessageHistory } from './message-history';
import { keyBy } from 'lodash';
import { DockyMessageIssueCreatedComponent } from '../custom-messages/docky-message-issue-created/docky-message-issue-created.component';

@Injectable({
  providedIn: 'root',
})
export class DockyBot {
  private aiService = inject(AiService);
  private sessionService = inject(SessionService);

  private sessionId = this.createSessionSeed();

  private idCounter = 0;

  toolHooks = {
    vacation_create: (
      tool_call: DockyMessageToolCall,
      history: MessageHistory,
    ) => {
      try {
        const payload = JSON.parse(tool_call.result as string);
        if (!payload.IssueID || !payload.number) {
          return null;
        }

        history.add({
          id: this.createMessageId('custom'),
          type: 'custom',
          component: DockyMessageIssueCreatedComponent,
          data: payload,
        });
      } catch (err) {
        console.error('Error parsing vacation_create tool call', err);
        return null;
      }
    },

    create_issue: (
      tool_call: DockyMessageToolCall,
      history: MessageHistory,
    ) => {
      try {
        const payload = JSON.parse(tool_call.result as string);
        if (!payload.IssueID || !payload.number) {
          return null;
        }

        history.add({
          id: this.createMessageId('custom'),
          type: 'custom',
          component: DockyMessageIssueCreatedComponent,
          data: payload,
        });
      } catch (err) {
        console.error('Error parsing issue_create tool call', err);
        return null;
      }
    },
  };

  async getAssistantInfo(): Promise<AiServiceStaticResponse> {
    return await this.aiService.getStatic();
  }

  resetSession(): void {
    this.sessionId = this.createSessionSeed();
  }

  // messages with last message is human message
  async *stream(messages: DockyMessage[], abortSignal?: AbortSignal) {
    const history = new MessageHistory(messages);

    const prompt = this.getLastHumanMessage(history);

    const stream = this.aiService.stream(
      {
        message: prompt.text,
        session_id: this.getChatSessionId(),
      },
      abortSignal,
    );

    let responseMessage: DockyMessageAgent = {
      id: this.createMessageId('agent'),
      type: 'agent',
      agentName: '',
      text: '',
      pending: true,
    };

    history.add(responseMessage);

    let toolCalled = false;

    for await (const event of stream) {
      console.log('event', event);
      switch (event.event) {
        case 'forward_to_agent':
          yield history
            .updateOne(responseMessage.id, {
              agentName: event.agent.name,
            })
            .toArray();
          break;
        case 'run_response_content':
          if (toolCalled) {
            // если запускают тулы, то завершаем текущее сообщение и создаем новое
            yield history
              .updateOne(responseMessage.id, { pending: false })
              .toArray();
            responseMessage = {
              id: this.createMessageId('agent'),
              type: 'agent',
              agentName: responseMessage.agentName,
              text: '',
              pending: true,
            };

            history.add(responseMessage);
            toolCalled = false;
          }

          yield history
            .updateOne<DockyMessageAgent>(responseMessage.id, (msg) => ({
              text: msg.text + event.content,
            }))
            .toArray();
          break;
        case 'run_response_completed':
          yield history
            .updateOne(responseMessage.id, { pending: false })
            .toArray();
          break;

        case 'tool_call_started': {
          toolCalled = true;

          // завершаем текущее сообщение т.к. при следующем тексте он должен быть за сообщениям тулами
          yield history
            .updateOne(responseMessage.id, { pending: false })
            .toArray();

          const toolCallMessage: DockyMessageToolCall = {
            id: event.tool.id,
            type: 'tool_call',
            pending: true,
            args: event.tool.args,
            tool: {
              name: event.tool.name,
              title: event.tool.title,
            },
          };
          yield history.add(toolCallMessage).toArray();
          break;
        }
        case 'tool_call_completed':
          yield history
            .updateOne<DockyMessageToolCall>(event.tool.id, {
              pending: false,
              result: event.tool.content,
            })
            .toArray();
          break;
      }
    }

    const diff = this.getDiff(messages, history.toArray());

    for (const message of diff) {
      if (message.type === 'tool_call') {
        const hook = this.toolHooks[message.tool.name];
        if (hook) {
          hook(message, history);
        }
      }
    }

    yield history.updateEach({ pending: false }).toArray();
  }

  private getDiff(
    oldMessages: DockyMessage[],
    currentMessages: DockyMessage[],
  ): DockyMessage[] {
    const oldMessagesMap = keyBy(oldMessages, 'id');

    return currentMessages.filter((message) => !oldMessagesMap[message.id]);
  }

  private getLastHumanMessage(
    history: MessageHistory,
  ): DockyMessageHuman | null {
    return history.at(-1) as DockyMessageHuman;
  }

  private createMessageId(prefix: string): string {
    this.idCounter += 1;
    return `${prefix}-${Date.now()}-${this.idCounter}`;
  }

  private createSessionSeed(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private getChatSessionId(): string {
    return this.sessionService.getCurrentEmployeeId() + '-' + this.sessionId;
  }
}
