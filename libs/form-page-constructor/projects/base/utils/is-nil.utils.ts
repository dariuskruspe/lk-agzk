export function isNil(value: unknown): boolean {
  if (!value) {
    if (value !== false && value !== 0 && value !== '') {
      return true;
    }
  }
  return false;
}
