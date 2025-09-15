import { request } from '@/service/request';
import type { OrderItem, OrderItemListResponse } from '@/types/order-item';

/**
 * 获取订单项列表
 * @param params 查询参数
 */
export const fetchOrderItemList = (params: {
  page: number;
  pageSize: number;
  orderNo?: string;
  status?: string;
}) =>
  request<OrderItemListResponse>({
    url: '/order-item',
    method: 'GET',
    params,
  });

/**
 * 获取订单的订单项
 * @param orderId 订单ID
 */
export const fetchOrderItems = (orderId: string) =>
  request<OrderItem[]>({
    url: `/order-item/order/${orderId}`,
    method: 'GET',
  });

/**
 * 创建订单项
 * @param data 订单项数据
 */
export const createOrderItem = (data: Partial<OrderItem>) =>
  request<OrderItem>({
    url: '/order-item',
    method: 'POST',
    data,
  });

/**
 * 批量创建订单项
 * @param data 批量订单项数据
 */
export const createBatchOrderItems = (data: {
  orderItems: Partial<OrderItem>[];
  orderNo?: string;
}) =>
  request<{
    success: boolean;
    count: number;
    message: string;
  }>({
    url: '/order-item/batch',
    method: 'POST',
    data,
  });

/**
 * 更新订单项
 * @param id 订单项ID
 * @param data 更新数据
 */
export const updateOrderItem = (id: string, data: Partial<OrderItem>) =>
  request<OrderItem>({
    url: `/order-item/${id}`,
    method: 'PUT',
    data,
  });

/**
 * 删除订单项
 * @param id 订单项ID
 */
export const deleteOrderItem = (id: string) =>
  request({
    url: `/order-item/${id}`,
    method: 'DELETE',
  });
