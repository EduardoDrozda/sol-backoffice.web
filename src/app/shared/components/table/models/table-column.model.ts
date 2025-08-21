export type TableColumn<T> = {
  key: keyof T & string;
  label: string;
  disabled?: boolean;
  value?: (row: T) => any;
  onChange?: (row: T, checked: boolean) => void;
  type?: 'checkbox' | 'actions';
  actions?: { label: string; icon?: string; callback: (row: T) => void }[];
  sortable?: boolean;
  width?: string | number;
}

export type TableField<T> = {
  key: keyof T;
  value: any;
}
