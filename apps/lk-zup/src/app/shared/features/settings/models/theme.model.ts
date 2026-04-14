export type BackendVisualTheme = 'default' | 'millennium' | 'dark';

export type AppThemeId =
  | 'light'
  | 'default_legacy'
  | 'millennium-classic'
  | 'liquid-dark'
  | 'dark';

export type ThemeStylesheetId = 'default_legacy' | 'millennium' | 'dark';

export type ThemeDataAttrValue = 'default' | 'millennium' | 'dark';

export interface AppThemeDefinition {
  value: AppThemeId;
  title: string;
  base: ThemeStylesheetId;
  dataTheme: ThemeDataAttrValue;
  liquid: boolean;
  light: boolean;
}
