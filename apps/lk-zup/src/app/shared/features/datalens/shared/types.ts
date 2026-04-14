export interface DatalensConfig {
  pages: DatalensPageConfig[];
}

export interface DatalensPageConfig {
  id: string;
  title: string;
  rows: DatalensWidgetConfig[][];
}

type ColSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DatalensWidgetConfig {
  type: 'widget';
  url: string; // https://datalens.yandex/1k5v9bzi1w78o?_embedded=1&_no_controls=1
  size: ColSize;
  rows: number;
}

// ?_embedded=1&_no_controls=1&_theme=light
