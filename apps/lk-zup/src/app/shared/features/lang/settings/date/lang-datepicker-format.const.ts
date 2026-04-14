import { LangDatapickerInterface } from '../../interfaces/lang-datapicker.interface';

export const LANG_DATEPICKER_FORMAT = (
  lang: string
): LangDatapickerInterface => {
  let dateFormat: string;
  switch (lang) {
    case 'ru':
      dateFormat = 'DD.MM.YYYY';
      break;
    case 'en':
      dateFormat = 'MM/DD/YYYY';
      break;
    case 'ru_month':
      dateFormat = 'MMMM YYYY';
      break;
    case 'en_month':
      dateFormat = 'MMMM YYYY';
      break;
    default:
      break;
  }
  return {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: dateFormat,
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  };
};
