export interface DocumentStatesInterface {
  documentsStates: DocumentStateInterface[];
}

/**
 * Интерфейс состояния (статуса) документа.
 */
export interface DocumentStateInterface {
  /**
   * UUID статуса документа.
   */
  id: string;

  /**
   * Название статуса документа (например, "К подписанию" или "Подписан").
   */
  name: string;

  color?: string;
  sign: boolean;
  buttonCaption: string;
}
