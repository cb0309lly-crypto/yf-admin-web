import { request } from '@/service/request';
import type { Product, ProductListResponse } from '@/types/product';

/**
 * 获取商品列表
 * @param params 查询参数：分页、模糊、分类、状态
 */
export const fetchProductList = (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  categoryNo?: string;
  status?: string;
}) =>
  request<ProductListResponse>({
    url: '/product/list',
    method: 'GET',
    params,
  });

/**
 * 新增商品
 * @param data 商品数据
 */
export const createProduct = (data: Partial<Product>) =>
  request<Product>({
    url: '/product',
    method: 'POST',
    data,
  });

/**
 * 编辑商品
 * @param data 商品数据（需带 no 字段）
 */
export const updateProduct = (data: Partial<Product>) =>
  request<Product>({
    url: '/product',
    method: 'PUT',
    data,
  });

/**
 * 删除商品
 * @param id 商品ID
 */
export const deleteProduct = (id: string) =>
  request({
    url: `/product/${id}`,
    method: 'DELETE',
  });

/**
 * 获取商品详情
 * @param id 商品ID
 */
export const fetchProductDetail = (id: string) =>
  request<Product>({
    url: `/product/${id}`,
    method: 'GET',
  }); 