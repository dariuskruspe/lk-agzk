// по схеме: [1, 2-4, 0 и 5-19],
// например ['объект', 'объекта', 'объектов'] и ['object', 'objects', 'objects']
// Так же можно передать массив
export function definePluralForm(
  defaultValue: number,
  forms: string[] | string[][],
  lang: 'ru' | 'en' = 'ru'
): string | string[] {
  const oneObjectEnding = ['1'];
  const fewObjectsEnding = ['2', '3', '4'];

  const value = Math.abs(defaultValue);
  if (lang === 'en') {
    return value === 1 ? forms[0] : forms[1];
  }

  const stringifiedValue = value.toString();
  const lastNumber = stringifiedValue.split('').pop();
  if (value < 10 || value > 20) {
    if (oneObjectEnding.includes(lastNumber)) {
      return forms[0];
    }
    if (fewObjectsEnding.includes(lastNumber)) {
      return forms[1];
    }
  }
  return forms[2];
}
