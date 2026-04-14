export interface StorageDataInterface<BackendDataType = any, FrontendDataType = any> {
  /**
   * Backend-данные.
   */
  backend?: BackendDataType;

  /**
   * Frontend-данные.
   */
  frontend?: FrontendDataType;

  [key: string]: any;
}
