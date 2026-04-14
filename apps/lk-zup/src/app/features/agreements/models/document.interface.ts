import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';
import { SignatureInfoInterface } from '@shared/features/signature-validation-form/models/signature-info.interface';
import { FileOwners } from '@shared/models/files.interface';

/**
 * Интерфейс документа сотрудника.
 */
export interface DocumentInterface {
  /**
   * Идентификатор документа/соглашения.
   */
  id: string;

  /**
   * Название документа/соглашения.
   */
  name: string;

  /**
   * ID (UUID) файла документа/соглашения.
   */
  fileID: string;

  /**
   * Имя файла.
   */
  fileName: string;

  /**
   * Название подразумевает, что тут должно храниться состояние (в редких случаях это слово переводится как "статус"),
   * но на самом деле тут хранится ID (UUID) текущего статуса документа (например,
   * "680e9c1b-5e55-11ec-810e-00155d28d802" для статуса "К подписанию").
   */
  state: string;

  /**
   * ФИО сотрудника.
   */
  employeeName: string;

  /**
   * Владелец файла.
   */
  fileOwner: FileOwners;

  /**
   * UUID заявки.
   */
  issueID?: string;

  /**
   * id заявки.
   */
  issueId?: string;

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

  settings?: {
    vacationBlockApp?: boolean;
    vacationConfirmationIsAvailable: boolean;
    vacationShiftingIsAvailable: boolean;
    vacationStartDate: string;
    vacationEndDate: string;
    vacationShiftingAlias: string;
    vacationTypeID: string;
  };

  /**
   * Доступна ли кнопка подписания.
   */
  isSignable: boolean;

  currentRole?: SignRoles;
}

/**
 * Интерфейс параметров GET-запроса документа сотрудника /{lang}/wa_employee/{employeeID}/documents/{owner}/{id}
 */
export interface GetDocumentParamsInterface {
  /**
   * UUID документа.
   */
  id: string;

  /**
   * UUID текущего пользователя.
   */
  currentEmployeeId?: string;

  /**
   * Владелец (носитель) файла.
   */
  fileOwner: FileOwners;

  /**
   * Для сотрудника.
   */
  forEmployee?: boolean;

  /**
   * Роль подписанта.
   */
  role?: string;
}

export interface AgreementDocumentPageReqInterface {
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
