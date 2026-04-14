import { FpcInputsInterface } from '@root/libs/form-page-constructor/projects/base/models/fpc.interface';

// все методы мутируют templates
// находит поле в шаблоне по пути в глубь
export function findFieldDeepInTemplate(
  templates: FpcInputsInterface[],
  path: string[],
) {
  let field = templates.find((t) => t.formControlName === path[0]);
  if (!field) {
    return null;
  }

  if (path.length === 1) {
    return field;
  }

  path = path.slice(1);

  while (path.length > 0 && field.arrSmartList) {
    field = field.arrSmartList.find((i) => i.formControlName === path[0]);
    path = path.slice(1);
  }

  return field;
}
