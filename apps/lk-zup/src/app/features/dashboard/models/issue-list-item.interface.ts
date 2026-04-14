export interface IssueListItemSort {
  work?: IssueListItem[];
  agreed?: IssueListItem[];
  rejection?: IssueListItem[];
}

export interface IssueListItemInterface {
  issues: IssueListItem[];
}

export interface IssueListItem {
  IssueID: string | number;
  IssueTypeId: string;
  date: string;
  header: string;
  number: string;
  iconName: string;
  state: string;
  typeShortName: string;
  attachedFiles: boolean;
}
