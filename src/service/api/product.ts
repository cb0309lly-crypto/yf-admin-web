import { request } from '@/service/request';
import type { Product, ProductListResponse } from '@/types/product';

/**
 * 获取商品列表
 *
 * @param params 查询参数：分页、模糊、分类、状态
 */
export const fetchProductList = (params: {
  categoryNo?: string;
  keyword?: string;
  page: number;
  pageSize: number;
  status?: string;
}) =>
  request<ProductListResponse>({
    method: 'GET',
    params,
    url: '/product/list'
  });

/**
 * 新增商品
 *
 * @param data 商品数据
 */
export const createProduct = (data: Partial<Product>) =>
  request<Product>({
    data,
    method: 'POST',
    url: '/product'
  });

/**
 * 编辑商品
 *
 * @param data 商品数据（需带 no 字段）
 */
export const updateProduct = (data: Partial<Product>) =>
  request<Product>({
    data,
    method: 'PUT',
    url: '/product'
  });

/**
 * 删除商品
 *
 * @param id 商品ID
 */
export const deleteProduct = (id: string) =>
  request({
    method: 'DELETE',
    url: `/product/${id}`
  });

/**
 * 获取商品详情
 *
 * @param id 商品ID
 */
export const fetchProductDetail = (id: string) =>
  request<Product>({
    method: 'GET',
    url: `/product/${id}`
  });
