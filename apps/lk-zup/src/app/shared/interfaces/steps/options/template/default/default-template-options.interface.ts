import { CommonTemplateOptionsInterface } from '@shared/interfaces/steps/options/template/common/common-template-options.interface';

export interface DefaultTemplateOptionsInterface
  extends CommonTemplateOptionsInterface {
  /**
   * Ориентация таймлайна (отвечает за направление отображения шагов)
   */
  layout?: 'vertical' | 'horizontal';
}
