import { SignatureInfoInterface } from '@shared/features/signature-validation-form/models/signature-info.interface';
import { FileOwners } from '@shared/models/files.interface';

export interface AgreementEmployeeDocumentPageInterface {
  /**
   * ID (UUID) файла документа/соглашения.
   */
  fileID: string;

  /**
   * Название подразумевает, что тут должно храниться состояние (в редких случаях это слово переводится как "статус"),
   * но на самом деле тут хранится ID (UUID) текущего статуса документа (например,
   * "680e9c1b-5e55-11ec-810e-00155d28d802" для статуса "К подписанию").
   */
  state: string;

  /**
   * Идентификатор документа/соглашения.
   */
  id: string;

  /**
   * Имя файла.
   */
  fileName: string;
  name: string;

  /**
   * Имя сотрудника.
   */
  employeeName: string;

  /**
   * Владелец файла.
   */
  fileOwner: FileOwners;

  /**
   * Дата последнего обновления текущего статуса документа.
   */
  stateDate: string;

  /**
   * Обязательно для подписания.
   */
  mandatory: boolean;

  color?: string;
  icon?: string;
  status?: string;
  providers?: SignatureInfoInterface[] | null;

  /**
   * Для сотрудника.
   */
  forEmployee?: boolean;

  iconName?: string;

  /**
   * Доступен отказ от подписания.
   */
  refuseSignatureEnabled: boolean;

  /**
   * Алиас для получения списка причин отказа от подписания через запрос wa_issueTypes/optionList/${alias}.
   */
  refuseReasonList?: string;

  targetPresentationId?: number;
}

export interface AgreementEmployeeDocumentPageReqInterface {
  /**
   * Идентификатор документа/соглашения.
   */
  id?: string;

  /**
   * ID (UUID) текущего сотрудника.
   */
  currentEmployeeId?: string;

  /**
   * ID (UUID) файла документа/соглашения.
   */
  fileID?: string;

  /**
   * Владелец файла.
   */
  fileOwner: FileOwners;

  signInfo?: SignatureInfoInterface | null;
  providers?: SignatureInfoInterface[] | null;
  taskId?: string;

  /**
   * Для сотрудника.
   */
  forEmployee?: boolean;
}
