import { DockyMessage } from './types';
import { cloneDeep } from 'lodash';

export class MessageHistory {
  private messages: DockyMessage[] = [];

  constructor(initialMessages: DockyMessage[]) {
    this.messages = cloneDeep(initialMessages);
  }

  add(message: DockyMessage) {
    this.messages = [...this.messages, cloneDeep(message)];
    return this;
  }

  updateEach(
    patch:
      | Partial<DockyMessage>
      | ((message: DockyMessage) => Partial<DockyMessage>),
  ) {
    if (typeof patch !== 'function') {
      const data = patch;
      patch = (message: DockyMessage) => data as Partial<DockyMessage>;
    }

    this.messages = this.messages.map((message) => ({
      ...message,
      ...patch(message),
    })) as DockyMessage[];
    return this;
  }

  updateOne<T extends DockyMessage>(
    id: string,
    patch: Partial<T> | ((message: T) => Partial<T>),
  ) {
    if (typeof patch !== 'function') {
      const data = patch;
      patch = (message: T) => data as Partial<T>;
    }

    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, ...patch(message as T) } : message,
    );

    return this;
  }

  toArray(): DockyMessage[] {
    return cloneDeep(this.messages);
  }

  at(index: number): DockyMessage {
    return cloneDeep(this.messages.at(index));
  }
}
