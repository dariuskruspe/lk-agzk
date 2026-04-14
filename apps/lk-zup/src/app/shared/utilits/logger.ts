import { environment } from '@env/environment';

const loggerAdapters = [];

// если не прод, то выводим логи в консоль
if (!environment.production) {
  loggerAdapters.push(console);
}

function log(level: 'error' | 'warn' | 'log' | 'info', ...args: any[]) {
  for (const adapter of loggerAdapters) {
    adapter[level](...args);
  }
}

export function logError(err: any, msg = 'Error:') {
  log('error', `${msg}`, err);
}
export function logWarn(warnMsg: any, title = 'Warn:') {
  log('warn', `${title}`, warnMsg);
}

export function logDebug(...messages: any[]) {
  log('log', ...messages);
}
