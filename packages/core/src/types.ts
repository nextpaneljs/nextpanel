export interface ResourceConfig {
  model: string;
  slug: string;
  label: string;
  pluralLabel: string;
  icon: string;
  navigation: NavigationConfig;
  table: TableConfig;
  form: FormConfig;
  include?: Record<string, unknown>;
}

export interface NavigationConfig {
  group: string;
  sort: number;
  parent?: string | null;
}

export interface TableConfig {
  columns: ColumnDefinition[];
  filters: FilterDefinition[];
  actions: ActionDefinition[];
  defaultSort: { key: string; direction: "asc" | "desc" };
  perPage: number;
}

export interface ColumnDefinition {
  key: string;
  label: string;
  type: "text" | "badge" | "boolean" | "date" | "image";
  sortable?: boolean;
  searchable?: boolean;
  options?: Record<string, string>;
  format?: string;
  hidden?: boolean;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string }[];
}

export interface ActionDefinition {
  key: string;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  bulk?: boolean;
}

export interface FormConfig {
  fields: FieldDefinition[];
  layout?: FormLayout[];
}

export interface FieldDefinition {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "file"
    | "richtext"
    | "relation";
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  relation?: {
    model: string;
    displayField: string;
    valueField: string;
  };
  colSpan?: number;
  hiddenOn?: ("create" | "edit")[];
  visibleOn?: ("create" | "edit")[];
}

export interface FormLayout {
  type: "section";
  label: string;
  columns: number;
  fields: string[];
}

export function defineResource(config: ResourceConfig): ResourceConfig {
  return config;
}

export interface NextPanelActions {
  createRecord: (
    model: string,
    slug: string,
    data: Record<string, unknown>
  ) => Promise<unknown>;
  updateRecord: (
    model: string,
    slug: string,
    id: string,
    data: Record<string, unknown>
  ) => Promise<void>;
  deleteRecord: (
    model: string,
    slug: string,
    id: string
  ) => Promise<void>;
  getRelationOptions: (
    model: string,
    displayField: string,
    valueField: string
  ) => Promise<{ label: string; value: string }[]>;
}

export interface QueryOptions {
  model: string;
  page: number;
  perPage: number;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  filters?: Record<string, string>;
  search?: string;
  searchableFields?: string[];
  include?: Record<string, unknown>;
}

export interface QueryResult {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  perPage: number;
}
