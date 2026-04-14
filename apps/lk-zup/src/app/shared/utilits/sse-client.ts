export interface SSEOptions {
  headers?: Record<string, string>;
  body?: any;
}

export class SSERequestError extends Error {
  readonly name = 'SSERequestError';

  constructor(
    readonly status: number,
    readonly statusText: string,
    readonly body: string,
  ) {
    super(
      `Request failed with status ${status} (${statusText})${
        body ? `: ${body}` : ''
      }`,
    );
  }

  static async fromResponse(response: Response): Promise<SSERequestError> {
    let body = '';

    try {
      body = await response.text();
    } catch {
      body = '';
    }

    return new SSERequestError(response.status, response.statusText, body);
  }
}

export class SSEConnectionError extends Error {
  readonly name = 'SSEConnectionError';

  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
  }
}

export class SSEStreamProtocolError extends Error {
  readonly name = 'SSEStreamProtocolError';

  constructor(
    message: string,
    readonly payload?: string,
  ) {
    super(message);
  }
}

export class SSEClient {
  private parser?: SSEParser;

  constructor(
    private url: string,
    private method: string = 'POST',
  ) {}

  async *stream(options: SSEOptions = {}, abortSignal?: AbortSignal) {
    let response: Response;
    try {
      response = await fetch(this.url, {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: abortSignal,
      });
    } catch (error) {
      if (this.isAbortError(error, abortSignal)) {
        return;
      }

      throw new SSEConnectionError(
        'Failed to connect to SSE endpoint',
        error,
      );
    }

    if (!response.ok) {
      throw await SSERequestError.fromResponse(response);
    }

    const reader = response.body?.getReader();
    this.parser = new SSEParser();
    if (!reader) {
      throw new SSEConnectionError(
        'Failed to create stream reader: response body is empty',
      );
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        let readResult: ReadableStreamReadResult<Uint8Array>;
        try {
          readResult = await reader.read();
        } catch (error) {
          if (this.isAbortError(error, abortSignal)) {
            return;
          }

          throw new SSEConnectionError(
            'SSE stream connection was interrupted',
            error,
          );
        }

        const { done, value } = readResult;
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const events = this.parser.feed(chunk);

        for (const event of events) {
          const parsedEvent = this.parser.parseEvent(event);
          if (!parsedEvent) continue;
          if (parsedEvent.type === 'done') return;
          yield parsedEvent;
        }
      }

      const tail = decoder.decode();
      if (tail) {
        const events = this.parser.feed(tail);
        for (const event of events) {
          const parsedEvent = this.parser.parseEvent(event);
          if (!parsedEvent) continue;
          if (parsedEvent.type === 'done') return;
          yield parsedEvent;
        }
      }

      const pendingChunk = this.parser.flush();
      if (pendingChunk) {
        throw new SSEConnectionError(
          'SSE stream ended unexpectedly with incomplete event data',
        );
      }
    } finally {
      reader.releaseLock();
    }
  }

  private isAbortError(error: unknown, signal?: AbortSignal): boolean {
    if (signal?.aborted) return true;
    return error instanceof DOMException && error.name === 'AbortError';
  }
}

class SSEParser {
  private buffer = '';
  private readonly delimiter = /\r?\n\r?\n/;

  feed(chunk: string): string[] {
    this.buffer += chunk;
    const events: string[] = [];

    while (true) {
      const delimiterMatch = this.delimiter.exec(this.buffer);
      if (!delimiterMatch) break;

      const delimiterIndex = delimiterMatch.index;
      const delimiterLength = delimiterMatch[0].length;
      const event = this.buffer.slice(0, delimiterIndex);
      events.push(event);
      this.buffer = this.buffer.slice(delimiterIndex + delimiterLength);
    }

    return events;
  }

  flush(): string {
    const value = this.buffer.trim();
    this.buffer = '';
    return value;
  }

  parseEvent(eventStr: string): { type: string; data: any } | null {
    const lines = eventStr.split(/\r?\n/);
    let eventType = '';
    const dataChunks: string[] = [];

    for (const line of lines) {
      if (!line || line.startsWith(':')) continue;

      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataChunks.push(line.slice(5).trimStart());
      }
    }

    const data = dataChunks.join('\n');
    if (!data) return null;
    if (data === '[DONE]') return { type: 'done', data: null };

    let parsedData: any;
    try {
      parsedData = JSON.parse(data);
    } catch {
      throw new SSEStreamProtocolError('Failed to parse SSE event payload', data);
    }

    return {
      type: eventType || 'data',
      data: parsedData,
    };
  }
}
