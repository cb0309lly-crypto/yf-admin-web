export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  categoryLevel: number;
  children?: Category[];
  createdAt: string;
  description?: string;
  icon?: string;
  name: string;
  no: string;
  parentId?: string;
  sort: number;
  status: CategoryStatus;
  updatedAt: string;
}

export interface CategoryListResponse {
  list: Category[];
  total: number;
}
