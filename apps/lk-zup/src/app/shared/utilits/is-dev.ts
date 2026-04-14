export function isDev() {
  return localStorage.getItem('dev') === 'true';
}
