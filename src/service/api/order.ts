import { request } from '@/service/request';
import type { Order, OrderListResponse, OrderQueryParams } from '@/types/order';

/**
 * 获取订单列表
 * @param params 查询参数：分页、状态、支付状态、时间范围等
 */
export const fetchOrderList = (params: OrderQueryParams) =>
  request<OrderListResponse>({
    url: '/order/list',
    method: 'GET',
    params,
  });


/**
 * 编辑订单
 * @param data 订单数据（需带 no 字段）
 */
export const updateOrder = (data: Partial<Order>) =>
  request<Order>({
    url: '/order',
    method: 'PUT',
    data,
  });

/**
 * 删除订单
 * @param id 订单ID
 */
export const deleteOrder = (id: string) =>
  request({
    url: `/order/${id}`,
    method: 'DELETE',
  });

/**
 * 获取订单详情
 * @param id 订单ID
 */
export const fetchOrderDetail = (id: string) =>
  request<Order>({
    url: `/order/${id}`,
    method: 'GET',
  });

/**
 * 更新订单状态
 * @param id 订单ID
 * @param orderStatus 新状态
 */
export const updateOrderStatus = (id: string, orderStatus: string) =>
  request<Order>({
    url: `/order`,
    method: 'PUT',
    data: { no: id, orderStatus },
  });

/**
 * 创建订单
 * @param data 订单数据
 */
export const createOrder = (data: Partial<Order>) =>
  request<Order>({
    url: '/order',
    method: 'POST',
    data,
  });
