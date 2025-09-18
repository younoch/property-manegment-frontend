export interface KPI {
  label: string;
  value: number;
  icon: string;
  delta: number;
  money?: boolean;
  spark?: Array<[string, string | number]>;
}

export interface ChartData {
  [key: string]: Array<Array<string | number>>;
}

export interface TableData {
  id: string;
  [key: string]: string | number | Date;
}

export interface ChartOptions {
  [key: string]: any;
}
