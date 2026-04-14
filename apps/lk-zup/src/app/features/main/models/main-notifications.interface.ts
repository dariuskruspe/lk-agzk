export interface MainNotificationsInterface {
  id: string | null;
  date?: string;
  body: string;
  fileID: string;
  fileOwner: string;
  OwnerID: string;
  ownerName: string;
  issueID: string;
  iconName: string;
  isViewed: boolean;
  RoleSignatory?: "Сотрудник" | "Организация" | "Руководитель" | null;
}

export interface MainNotificationInterface {
  id: string;
  currentEmployeeId: string;
}
