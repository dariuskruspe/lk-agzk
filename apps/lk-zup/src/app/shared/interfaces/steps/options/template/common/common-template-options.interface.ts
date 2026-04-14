import { StepOptionsInterface } from '@shared/interfaces/steps/options/template/common/step-options.interface';

/**
 * Интерфейс общих для всех шаблонов отображения шагов параметров.
 */
export interface CommonTemplateOptionsInterface {
  /**
   * Параметры отображения обычного (не являющимся ни активным, ни подсвеченным) шага.
   */
  step?: StepOptionsInterface;

  /**
   * Параметры отображения активного шага (элемента с CSS-классом 'step active').
   */
  stepA?: StepOptionsInterface;

  /**
   * Параметры отображения подсвеченного шага (элемента с CSS-классом 'step highlight').
   */
  stepH?: StepOptionsInterface;
}
