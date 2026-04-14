/**
 * Интерфейс параметров шага.
 */
export interface StepOptionsInterface {
  /**
   * Параметры отображения секции таймлайна (элемента с CSS-классом 'step-timeline'), соответствующей шагу.
   */
  timeline?: {
    /**
     * CSS-стили секции таймлайна (элемента с CSS-классом 'step-timeline'), соответствующей шагу.
     */
    style?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Параметры отображения маркера шага (элемента с CSS-классом 'step-marker').
   */
  marker?: {
    /**
     * CSS-стили маркера шага (элемента с CSS-классом 'step-marker').
     */
    style?: Partial<CSSStyleDeclaration>;

    /**
     * Параметры отображения иконки маркера шага (элемента с CSS-классом 'step-marker-icon').
     */
    icon?: {
      /**
       * Отображать ли иконку маркера шага (элемента с CSS-классом 'step-marker-icon').
       */
      show?: boolean;

      /**
       * CSS-стили иконки маркера шага (элемента с CSS-классом 'step-marker-icon').
       */
      style?: Partial<CSSStyleDeclaration>;
    };
  };

  /**
   * Параметры отображения линии, проходящей между соседними шагами (элемента с CSS-классом 'step-divider' или
   * 'p-timeline-event-connector'), соединяющей или разделяющей шаги, как посмотреть... ^_^.
   */
  divider?: {
    /**
     * CSS-стили линии, проходящей между соседними шагами (элемента с CSS-классом 'step-divider' или
     * 'p-timeline-event-connector'), соединяющей или разделяющей шаги, как посмотреть... ^_^.
     */
    style?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Параметры отображения содержимого шага (элемента с CSS-классом 'step-content').
   */
  content?: {
    /**
     * CSS-стили содержимого шага (элемента с CSS-классом 'step-content').
     */
    style?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Параметры отображения метки шага (элемента с CSS-классом 'step-label').
   */
  label?: {
    /**
     * CSS-стили метки шага (элемента с CSS-классом 'step-label').
     */
    style?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Параметры отображения названия шага (элемента с CSS-классом 'step-title').
   */
  title?: {
    /**
     * CSS-стили названия шага (элемента с CSS-классом 'step-title').
     */
    style?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Параметры отображения описания шага (элемента с CSS-классом 'step-description').
   */
  description?: {
    /**
     * CSS-стили описания шага (элемента с CSS-классом 'step-description').
     */
    style?: Partial<CSSStyleDeclaration>;
  };
}
