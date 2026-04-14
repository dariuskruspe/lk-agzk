import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { SignatureValidationType } from './signature-validation-type.interface';

export interface ProvidersInterface {
  signProviders: SignatureProviderInterface[];
}

export interface ProviderUserDataInterface {
  key?: string;
  value: any;
  title?: string;
}

export interface SignatureProviderInterface {
  metadata: {
    id: string;
    signType: string;
    confirmMethod: SignatureValidationType;
    app: string;
    issueTypeAlias?: string;
  };
  ui: {
    // подсказа для отключённой [disabled] кнопки "Выпустить подпись"
    tooltipText: string;
    description: string;
    show: boolean;
    logo: string;
    name: string;
    buttonCaption: string;
    // Доступна ли кнопка [!disabled]
    buttonAvailable: true;
    linkedIssueTypes: {
      id: string;
      name: string;
    }[];
    blockingIssues: {
      id: string;
      name: string;
    }[];
    // Требуется ли установка (задание) пароля при выпуске ЭЦП
    requirePasswordSetup?: boolean;
    userData?: ProviderUserDataInterface[];
    certs?: {
      serialNumber: string;
      dateBegin: string;
      dateEnd: string;
      commonName: string;
      revocationTime: string;
      assignment: string;
      requestStatus?: string;
      requestStatusDescription?: string;
      requestID?: string;
      steps?: StepInterface[];
    }[];
    hasCertInProgress?: boolean;

    /**
     * Доступно ли массовое подписание документов для данного провайдера ЭЦП.
     */
    bulkDocumentSigning?: boolean;

    /**
     * Тип (режим) массового подписания документов для данного провайдера ЭЦП.
     *
     * Используется помимо всего прочего для определения страниц (или разделов) на фронте, на (в) которых допускается
     * использование массового подписания документов при помощи ЭЦП от данного провайдера.
     *
     * 'org' (подписание от организации) — страница "Документы на подпись" (пункт "Менеджер" главного меню)
     *
     * 'employee' (подписание от сотрудника) — страница "Мои документы" (пункт "Сотрудник" главного меню)
     *
     * 'orgAndEmployee' (доступно подписание как от организации, так и от сотрудника) — на всех страницах,
     * соответствующих типу 'org' или 'employee'
     */
    bulkDocumentSigningMode?: BulkDocumentSigningMode;
  };
}

export type BulkDocumentSigningMode = 'org' | 'employee' | 'orgAndEmployee';
