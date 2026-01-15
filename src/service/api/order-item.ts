import { request } from '@/service/request';
import type { OrderItem, OrderItemListResponse } from '@/types/order-item';

/**
 * 获取订单项列表
 *
 * @param params 查询参数
 */
export const fetchOrderItemList = (params: { orderNo?: string; page: number; pageSize: number; status?: string }) =>
  request<OrderItemListResponse>({
    method: 'GET',
    params,
    url: '/order-item'
  });

/**
 * 获取订单的订单项
 *
 * @param orderId 订单ID
 */
export const fetchOrderItems = (orderId: string) =>
  request<OrderItem[]>({
    method: 'GET',
    url: `/order-item/order/${orderId}`
  });

/**
 * 创建订单项
 *
 * @param data 订单项数据
 */
export const createOrderItem = (data: Partial<OrderItem>) =>
  request<OrderItem>({
    data,
    method: 'POST',
    url: '/order-item'
  });

/**
 * 批量创建订单项
 *
 * @param data 批量订单项数据
 */
export const createBatchOrderItems = (data: { orderItems: Partial<OrderItem>[]; orderNo?: string }) =>
  request<{
    count: number;
    message: string;
    success: boolean;
  }>({
    data,
    method: 'POST',
    url: '/order-item/batch'
  });

/**
 * 更新订单项
 *
 * @param id 订单项ID
 * @param data 更新数据
 */
export const updateOrderItem = (id: string, data: Partial<OrderItem>) =>
  request<OrderItem>({
    data,
    method: 'PUT',
    url: `/order-item/${id}`
  });

/**
 * 删除订单项
 *
 * @param id 订单项ID
 */
export const deleteOrderItem = (id: string) =>
  request({
    method: 'DELETE',
    url: `/order-item/${id}`
  });
