import {
  AppThemeDefinition,
  AppThemeId,
} from '../models/theme.model';

export const DEFAULT_APP_THEME: AppThemeId = 'light';

export const APP_THEMES = [
  {
    value: 'light',
    title: 'THEME_LIGHT',
    base: 'default_legacy',
    dataTheme: 'default',
    liquid: true,
    light: true,
  },
  {
    value: 'default_legacy',
    title: 'DEFAULT_LEGACY_THEME',
    base: 'default_legacy',
    dataTheme: 'default',
    liquid: false,
    light: true,
  },
  {
    value: 'millennium-classic',
    title: 'MILLENNIUM_THEME',
    base: 'millennium',
    dataTheme: 'millennium',
    liquid: false,
    light: true,
  },
  {
    value: 'liquid-dark',
    title: 'THEME_LIQUID_DARK',
    base: 'dark',
    dataTheme: 'dark',
    liquid: true,
    light: false,
  },
] as const satisfies readonly AppThemeDefinition[];

const THEMES_BY_ID: Record<AppThemeId, AppThemeDefinition> = APP_THEMES.reduce(
  (acc, theme) => {
    acc[theme.value] = theme;
    return acc;
  },
  {} as Record<AppThemeId, AppThemeDefinition>,
);

const THEME_ALIAS_MAP: Readonly<Record<string, AppThemeId>> = {
  light: 'light',
  default: DEFAULT_APP_THEME,
  default_legacy: 'default_legacy',
  millennium: 'millennium-classic',
  'millennium-classic': 'millennium-classic',
  dark: 'liquid-dark',
  'liquid-dark': 'liquid-dark',
};

export function resolveTheme(theme?: string | null): AppThemeId {
  if (!theme) {
    return DEFAULT_APP_THEME;
  }

  return THEME_ALIAS_MAP[theme] ?? DEFAULT_APP_THEME;
}

export function getThemeDetail(theme?: string | null): AppThemeDefinition {
  return THEMES_BY_ID[resolveTheme(theme)];
}
