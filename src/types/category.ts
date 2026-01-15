export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  no: string;
  name: string;
  description?: string;
  icon?: string;
  status: CategoryStatus;
  parentId?: string;
  sort: number;
  categoryLevel: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryListResponse {
  list: Category[];
  total: number;
}

