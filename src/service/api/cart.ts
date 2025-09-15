import { request } from '@/service/request';
import type { Cart, CartListResponse, UserCartResponse } from '@/types/cart';

/**
 * 获取购物车列表
 * @param params 查询参数
 */
export const fetchCartList = (params: {
  page: number;
  pageSize: number;
  status?: string;
  userNo?: string;
}) =>
  request<CartListResponse>({
    url: '/cart',
    method: 'GET',
    params,
  });

/**
 * 获取用户购物车
 * @param userId 用户ID
 */
export const fetchUserCart = (userId: string) =>
  request<UserCartResponse>({
    url: `/cart/user/${userId}`,
    method: 'GET',
  });

/**
 * 添加商品到购物车
 * @param data 购物车数据
 */
export const addToCart = (data: {
  productNo: string;
  quantity: number;
  userNo: string;
}) =>
  request<Cart>({
    url: '/cart/add',
    method: 'POST',
    data,
  });

/**
 * 从购物车移除商品
 * @param data 移除数据
 */
export const removeFromCart = (data: {
  productNo: string;
  userNo: string;
}) =>
  request({
    url: '/cart/remove',
    method: 'POST',
    data,
  });

/**
 * 更新购物车商品数量
 * @param data 更新数据
 */
export const updateCartQuantity = (data: {
  id: string;
  quantity: number;
}) =>
  request<Cart>({
    url: '/cart/update-quantity',
    method: 'POST',
    data,
  });

/**
 * 清空购物车
 * @param userNo 用户编号
 */
export const clearCart = (userNo: string) =>
  request({
    url: '/cart/clear',
    method: 'POST',
    data: { userNo },
  });
