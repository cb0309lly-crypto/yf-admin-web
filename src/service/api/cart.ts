import { request } from '@/service/request';
import type { Cart, CartListResponse, UserCartResponse } from '@/types/cart';

/**
 * 获取购物车列表
 *
 * @param params 查询参数
 */
export const fetchCartList = (params: { page: number; pageSize: number; status?: string; userNo?: string }) =>
  request<CartListResponse>({
    method: 'GET',
    params,
    url: '/cart'
  });

/**
 * 获取用户购物车
 *
 * @param userId 用户ID
 */
export const fetchUserCart = (userId: string) =>
  request<UserCartResponse>({
    method: 'GET',
    url: `/cart/user/${userId}`
  });

/**
 * 添加商品到购物车
 *
 * @param data 购物车数据
 */
export const addToCart = (data: { productNo: string; quantity: number; userNo: string }) =>
  request<Cart>({
    data,
    method: 'POST',
    url: '/cart/add'
  });

/**
 * 从购物车移除商品
 *
 * @param data 移除数据
 */
export const removeFromCart = (data: { productNo: string; userNo: string }) =>
  request({
    data,
    method: 'POST',
    url: '/cart/remove'
  });

/**
 * 更新购物车商品数量
 *
 * @param data 更新数据
 */
export const updateCartQuantity = (data: { id: string; quantity: number }) =>
  request<Cart>({
    data,
    method: 'POST',
    url: '/cart/update-quantity'
  });

/**
 * 清空购物车
 *
 * @param userNo 用户编号
 */
export const clearCart = (userNo: string) =>
  request({
    data: { userNo },
    method: 'POST',
    url: '/cart/clear'
  });
