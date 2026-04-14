import { SignatureInfoInterface } from '@shared/features/signature-validation-form/models/signature-info.interface';
import {
  FpcInputsInterface,
  FpcOptionInterface,
} from '@wafpc/base/models/fpc.interface';
import { CrossPeriodsListItemInterface } from '@shared/components/item-link-list/item-link-list/item-link-list.component';

export interface IssuesTypesInterface {
  issueTypeGroups?: IssueTypeGroups[];
}

export interface IssueTypeGroups {
  groupCode: string;
  groupName: string;
  issueTypes: IssueTypes[];
  groupIsInList: boolean;
  groupAlias: string;
}

export interface IssueTypes {
  issueTypeID?: string;
  issueTypeFullName?: string;
  issueTypeShortName?: string;
  issueTypeIsInList?: boolean;
  useAsLink?: boolean;
  useAsCustomTemplate?: boolean;
  issueTypeAlias?: string;
  onApplicant: boolean;
  onOtherEmployees: boolean;
  onboardingCssClass: string;
  providers?: SignatureInfoInterface[] | null;
  issueTypeDescription?: string;
  issueTypeIconName?: string;
  issueTypeSignatureEnable?: boolean;
  cancelDisable?: boolean;
}

export interface IssuesTypeItemTemplateInterface {
  issue: IssuesTypesTemplateInterface;
}

export interface IssueTypeTemplateFieldMappingInterface {
  name: string;
  nameOnFront: string;
  nameOnIssue: string;
  uniquenessControl: boolean;
  parent: number;
  id: string;
  indicator: string;
  fileForSignature: boolean;
  onOtherEmployees: boolean;
  onApplicant: boolean;
  onOtherEmployeesIsEmpField: boolean;
  onApplicantIsEmpField: boolean;
}

export interface IssuesTypesTemplateInterface {
  issueTypeID: string;
  FullName: string;
  ShortName: string;
  signatureEnable?: boolean;
  template: FpcInputsInterface[];
  formFields?: IssueTypeTemplateFieldMappingInterface[];
  originTemplate?: FpcInputsInterface[];
  templateOnOtherEmployees?: FpcInputsInterface[];
  onApplicant?: boolean;
  onOtherEmployees?: boolean;
  options: FpcOptionInterface;
  signInfo?: SignatureInfoInterface;
  cancelDisable?: boolean;
  useAsCustomTemplate?: boolean;
  alias?: string;
  crossPeriods?: CrossPeriodsListItemInterface[];
  iconName?: string;
  description?: string;
  showInSelectionList?: boolean;
  quickAccess?: boolean;
  createByAssistant?: boolean;
  aiPrompt?: string;
  used: boolean;
}
