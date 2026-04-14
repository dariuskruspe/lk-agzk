import { FileOwners } from '@shared/models/files.interface';
import { SignatureInfoInterface } from '../../signature-validation-form/models/signature-info.interface';
import { SignRoles } from './sign-roles.enum';

export interface DocSignatureInterface {
  id: string;
  name: string;
  fileName: string;
  issueID?: string;
  fileID: string;
  fileOwner: FileOwners;
  state: string;
  mandatory: boolean;
  stateDate: string;
  providers: SignatureInfoInterface[] | null;
  forEmployee?: boolean;
  refuseSignatureEnabled: boolean;
  /**
   * Алиас для получения списка причин отказа от подписания через запрос wa_issueTypes/optionList/${alias}.
   */
  refuseReasonList?: string;
  targetPresentationId?: number;
  currentRole?: SignRoles;
  availableRoles?: SignRoles[];
}

export interface FileSignatureInterface {
  fileID: string;
  taskId?: string;
  owner: FileOwners;
  signInfo?: {
    sig?: string;
    provider?: string;
    password?: string;
  };
}
