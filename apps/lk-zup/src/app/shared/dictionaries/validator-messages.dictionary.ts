import { definePluralForm } from '../utilits/pluralize.util';

export const ValidatorMessages = {
  email: 'VALIDATOR_EMAIL',
  required: 'VALIDATOR_REQUIRED',
  hasNumber: 'VALIDATOR_PATTERN_NUMBER',
  hasSpace: 'VALIDATOR_PATTERN_SPACE',
  hasCapitalCase: 'VALIDATOR_PATTERN_CAPITAL_CASE',
  hasSmallCase: 'VALIDATOR_PATTERN_SMALL_CASE',
  hasSpecialCharacters: 'VALIDATOR_PATTERN_SPECIAL',
  minlength: 'VALIDATOR_MIN_LENGTH',
  maxlength: 'VALIDATOR_MAX_LENGTH',
  hasUnacceptableSymbols: 'VALIDATOR_PATTERN_LATIN',
  hasMatch: 'VALIDATOR_PASSWORD_INCORRECT',
  hasDifference: 'VALIDATOR_OLD_PASSWORD_COINCEDIES',
};

export const ValidatorValueKeys: {
  [key: string]: (value: string | number, lang: string) => string[];
} = {
  requiredLength: (value: number, lang: string = 'ru'): string[] => {
    const pluralForm = definePluralForm(
      value,
      ['CHARACTER_ONE', 'CHARACTER_TWO', 'CHARACTER_MANY'],
      lang as 'ru' | 'en'
    ) as string;
    return [`${value ?? ''}`, pluralForm];
  },
};
