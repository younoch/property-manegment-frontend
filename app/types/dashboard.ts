export interface KPI {
  id: string;
  label: string;
  value: number;
  icon: string;
  money?: boolean;
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
