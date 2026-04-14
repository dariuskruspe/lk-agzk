import { Type } from '@angular/core';

export type DockyMessageToolInfo = {
  name: string;
  title: string;
};

export type DockyMessageToolCall = {
  id: string;
  type: 'tool_call';
  pending: boolean;
  args: unknown[];
  result?: unknown;
  tool: DockyMessageToolInfo;
};

export type DockyMessageHuman = {
  id: string;
  type: 'human';
  text: string;
};

export type DockyMessageAgent = {
  id: string;
  type: 'agent';
  agentName: string;
  text: string;
  pending: boolean;
};

export type DockyMessageError = {
  id: string;
  type: 'error';
  canRetry: boolean;
  text: string;
};

export type DockyMessageSystem = {
  id: string;
  type: 'system';
  text: string;
};

// кастомные сообщения, для отображения которых нужно использовать кастомный компонент
// Например, показать информацию о том, что заявка на отпуск создана с кнопкой перехода на страницу заявки

export type DockyMessageCustom = {
  id: string;
  type: 'custom';
  component: Type<unknown>;
  data: unknown;
};

export type DockyMessage =
  | DockyMessageToolCall
  | DockyMessageHuman
  | DockyMessageAgent
  | DockyMessageError
  | DockyMessageSystem
  | DockyMessageCustom;
