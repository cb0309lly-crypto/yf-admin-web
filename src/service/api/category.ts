import { request } from '@/service/request';
import type { Category, CategoryListResponse } from '@/types/category';

export const fetchCategoryList = (params: {
  keyword?: string;
  page?: number;
  pageSize?: number;
  parentId?: string;
  status?: string;
}) =>
  request<CategoryListResponse>({
    method: 'GET',
    params,
    url: '/category/list'
  });

export const fetchCategoryTree = () =>
  request<Category[]>({
    method: 'GET',
    url: '/category/tree/list'
  });

export const createCategory = (data: Partial<Category>) =>
  request<Category>({
    data,
    method: 'POST',
    url: '/category'
  });

export const updateCategory = (id: string, data: Partial<Category>) =>
  request<Category>({
    data,
    method: 'PUT',
    url: `/category/${id}`
  });

export const deleteCategory = (id: string) =>
  request({
    method: 'DELETE',
    url: `/category/${id}`
  });
