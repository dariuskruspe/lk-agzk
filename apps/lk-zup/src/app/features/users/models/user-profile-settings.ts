export interface UserProfileSettings {
  dashboardSettings: UserProfileSettingsItem[];
}

export interface UserProfileSettingsItem {
  name: string;
  enable: boolean;
  order: boolean;
}
