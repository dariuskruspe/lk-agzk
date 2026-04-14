export function isDateInvalid(date: string | Date): boolean {
  let value = date;
  if (typeof date === 'string') {
    value = new Date(date);
  }
  return (!value || value.toString()?.toLowerCase() === 'invalid date');
}
