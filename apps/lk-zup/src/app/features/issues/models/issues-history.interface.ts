export interface IssuesHistoryInterface {
  states: IssuesHistoryItem[];
}

export interface IssuesHistoryItem {
  date: Date;
  stateID?: string;
  stateName: string;
  userID: string;
  user: string;
  role: string;
  comment: string;
  color: string;
  userName: string;
  agreement: any[];
}
