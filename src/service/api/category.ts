import { request } from '@/service/request';
import type { Category, CategoryListResponse } from '@/types/category';

export const fetchCategoryList = (params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  parentId?: string;
}) =>
  request<CategoryListResponse>({
    url: '/category/list',
    method: 'GET',
    params,
  });

export const fetchCategoryTree = () =>
  request<Category[]>({
    url: '/category/tree/list',
    method: 'GET',
  });

export const createCategory = (data: Partial<Category>) =>
  request<Category>({
    url: '/category',
    method: 'POST',
    data,
  });

export const updateCategory = (id: string, data: Partial<Category>) =>
  request<Category>({
    url: `/category/${id}`,
    method: 'PUT',
    data,
  });

export const deleteCategory = (id: string) =>
  request({
    url: `/category/${id}`,
    method: 'DELETE',
  });

