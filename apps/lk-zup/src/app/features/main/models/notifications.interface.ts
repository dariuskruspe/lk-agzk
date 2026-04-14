export interface NotificationItemInterface {
  id: string;
  issueId?: string;
  ownerId?: string;
  owner?: string;
  icon?: string;
  title?: string;
  message: string;
  date?: string;
  locked?: boolean;
  payload?: any;
  checked?: boolean;
  isViewed?: boolean;
  RoleSignatory?: "Сотрудник" | "Организация" | "Руководитель" | null;
}
