export interface BlurDialogHandlerOptionsInterface {
  /**
   * CSS-класс для определения диалогового окна.
   */
  dialogClass?: string;

  /**
   * Массив CSS-классов для элементов, являющихся исключениями (при их нажатии не будет происходить вызова blurCallback).
   */
  exceptElementClasses?: string[];
}
