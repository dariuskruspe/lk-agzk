import { computed, effect, inject, Injectable } from '@angular/core';
import { GlobalSettingsStateService } from '../states/global-settings-state.service';
import { SSEClient } from '../utilits/sse-client';
import { UserStateService } from '../states/user-state.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private settings = inject(GlobalSettingsStateService).state;
  private userState = inject(UserStateService);
  private sessionService = inject(SessionService);

  readonly url = computed(
    () => this.settings().assistant?.aiApiUrl ?? '/ai-service',
  );

  constructor() {
    effect(() => {
      console.log('AI service url:', this.url());
    });
  }

  async *stream(options: AiServiceStreamOptions, abortSignal?: AbortSignal) {
    const sseClient = new SSEClient(this.url() + '/stream', 'POST');

    const stream = sseClient.stream(
      {
        body: {
          access_token: this.sessionService.getAccessToken(),
          user_id: this.userState.current()!.userID,
          employee_id: this.userState.activeEmployeeId(),
          ...options,
        },
      },
      abortSignal,
    );

    for await (const event of stream) {
      yield event.data as AiServiceStreamEvent;
    }
  }

  async getStatic(abortSignal?: AbortSignal) {
    const response = await fetch(this.url() + '/assistant/static', {
      signal: abortSignal,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch static data');
    }
    return response.json() as Promise<AiServiceStaticResponse>;
  }
}

export type AiServiceStreamOptions = {
  message: string;
  session_id: string;
};

export type AiServiceAgentBasicInfo = {
  id: string;
  name: string;
};

export type AiServiceStreamToolCall = {
  id: string;
  name: string;
  title: string;
  args: unknown[];
  content: string;
};

export type AiServiceStreamEventForwardToAgent = {
  event: 'forward_to_agent';
  agent: AiServiceAgentBasicInfo;
};

export type AiServiceStreamEventRunResponseContent = {
  event: 'run_response_content';
  content: string;
};

export type AiServiceStreamEventRunResponseCompleted = {
  event: 'run_response_completed';
  content: string;
};

export type AiServiceStreamEventToolCallStarted = {
  event: 'tool_call_started';
  tool: AiServiceStreamToolCall;
};

export type AiServiceStreamEventToolCallCompleted = {
  event: 'tool_call_completed';
  tool: AiServiceStreamToolCall;
};

export type AiServiceStreamEvent =
  | AiServiceStreamEventForwardToAgent
  | AiServiceStreamEventRunResponseContent
  | AiServiceStreamEventRunResponseCompleted
  | AiServiceStreamEventToolCallStarted
  | AiServiceStreamEventToolCallCompleted;

export type AiServiceStaticResponse = {
  custom_agents: AiServiceAgentInfo[];
  builtin_agents: AiServiceAgentInfo[];
  tools: AiServiceToolInfo[];
};

export type AiServiceAgentInfo = {
  name: string;
  intro: string;
  example_queries: string[];
};

export type AiServiceToolInfo = {
  name: string;
  title: string;
  description: string;
  group: string;
  doc: string;
};
