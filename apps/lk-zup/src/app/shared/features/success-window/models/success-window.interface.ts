import { SignatureInfoInterface } from '../../signature-validation-form/models/signature-info.interface';

export interface SuccessWindowInterface {
  useComponent?: 'agreement' | 'default';
  navigation?: string[];
  message: string;
  buttonLabel: string;
  status: number;
}

export interface SuccessDataInterface {
  contents: string;
  date: string;
  formData: FormDataInterface;
  header: string;
  issueID: string;
  issueTypeID: string;
  number: string;
  state: number;
  success: boolean;
  typeShortName: string;
}

export interface FormDataInterface {
  IssueID?: string;
  approve?: boolean;
  dateBegin?: string;
  dateEnd?: string;
  employeeID?: string;
  issueTypeID?: string;
  oldDateBegin?: string;
  oldDateEnd?: string;
  requestType?: string;
  title?: string;
  userID?: string;
  state?: string;
  signInfo?: SignatureInfoInterface | null;
}
