export interface GetAncestorsOptionsInterface {
  /**
   * Использовать ли JavaScript-метод reverse для результирующего массива.
   */
  useReverse?: boolean;

  /**
   * CSS-класс для стоп-элемента, дальше которого предки искаться не будут.
   */
  stopElementClass?: string;
}
