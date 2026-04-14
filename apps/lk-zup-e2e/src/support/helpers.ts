function normalizeDate(date: Date | string): Date {
  let value = date;
  if (typeof date === 'string') {
    value = new Date(date);
  }
  if (!value || value.toString()?.toLowerCase() === 'invalid date') {
    value = new Date();
  }
  return new Date(
    Date.UTC(
      (value as Date).getFullYear(),
      (value as Date).getMonth(),
      (value as Date).getDate()
    )
  );
}

export const CyHelpers = {
  normalizeDate,
};
