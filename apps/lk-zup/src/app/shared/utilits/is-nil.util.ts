export function isNil(value: unknown): boolean {
  return (
    (!value || value === 'undefined' || value === 'null') &&
    value !== 0 &&
    value !== '' &&
    value !== false
  );
}
