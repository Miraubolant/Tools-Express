export interface StudyInfo {
  name: string;
  orderNumber: string;
  saleName: string;
  logo: string | null;
}

export interface LotRange {
  start: number;
  end: number;
}

export interface Background {
  type: 'none' | 'color' | 'image';
  value: string;
}

export interface GridConfig {
  columns: number;
  rows: number;
  margin: number;
  spacing: number;
}

export interface TextColors {
  title: string;
  subtitle: string;
  number: string;
}