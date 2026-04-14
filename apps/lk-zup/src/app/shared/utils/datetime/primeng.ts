/*******************************************************************************
 * Функции для работы с датами/временем и их периодами применительно к PrimeNG *
 *******************************************************************************/

import { logError } from '@shared/utilits/logger';

/**
 * Преобразуем PrimeNG-метаданные даты (dateMeta) в обычную дату (JavaScript-объект Date).
 *
 * @param dateMeta PrimeNG-метаданные даты (используется в PrimeNG-компоненте p-calendar,
 * см. https://github.com/primefaces/primeng/blob/41575780a6dd09d8e42a02df65cec86ca3b209d0/src/app/components/calendar/calendar.ts#L1611)
 */
export function dateMeta2Date(dateMeta: any): Date {
  const failedConvertMessage =
    'Failed to convert dateMeta (date metadata) to date: invalid dateMeta!';

  if (!dateMeta) throw new Error(failedConvertMessage);

  let resultDate: Date;

  try {
    resultDate = new Date(
      Date.UTC(dateMeta.year, dateMeta.month, dateMeta.day)
    );
  } catch (e) {
    logError(e);
    throw new Error(failedConvertMessage);
  }
  return resultDate;
}
