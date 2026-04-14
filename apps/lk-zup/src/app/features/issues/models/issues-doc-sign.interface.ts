import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';
import { SignatureInfoInterface } from '../../../shared/features/signature-validation-form/models/signature-info.interface';
import { FileOwners } from '../../../shared/models/files.interface';

export interface IssuesDocSignInterface {
  id: string;
  name: string;
  fileName: string;
  issueID: string;
  fileID: string;
  fileOwner: FileOwners;
  state: string;
  stateDate: string;
  providers: SignatureInfoInterface[] | null;
  currentRole: SignRoles;
}

export interface IssuesDocSignInfo {
  userID: string;
  userName: string;
  date: string;
  type: string;
  fileName: string;
  fileRef: string;
}
