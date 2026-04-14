import { environment as dev } from './environment.develop';

export function getEnvironment(conf: string = 'develop'): Record<string, any> {
  switch (conf) {
    case 'develop':
    default:
      return dev;
  }
}
