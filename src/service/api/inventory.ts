import { request } from '@/service/request';
import type {
  Inventory,
  InventoryListResponse,
  InventoryOperation,
  InventoryOperationListResponse
} from '@/types/inventory';

/**
 * 获取库存列表
 *
 * @param params 查询参数：分页、商品编号等
 */
export const fetchInventoryList = (params: { page: number; pageSize: number; productNo?: string; status?: string }) =>
  request<InventoryListResponse>({
    method: 'GET',
    params,
    url: '/inventory/list'
  });

/**
 * 获取商品库存详情
 *
 * @param productNo 商品编号
 */
export const fetchInventoryByProduct = (productNo: string) =>
  request<Inventory>({
    method: 'GET',
    url: `/inventory/product/${productNo}`
  });

/**
 * 创建或更新库存
 *
 * @param data 库存数据
 */
export const saveInventory = (data: Partial<Inventory>) =>
  request<Inventory>({
    data,
    method: 'POST',
    url: '/inventory'
  });

/**
 * 更新库存
 *
 * @param data 库存数据（需带 id 字段）
 */
export const updateInventory = (data: Partial<Inventory>) =>
  request<Inventory>({
    data,
    method: 'PUT',
    url: '/inventory'
  });

/**
 * 库存操作（入库、出库、调整）
 *
 * @param data 库存操作数据
 */
export const performInventoryOperation = (data: Partial<InventoryOperation>) =>
  request<InventoryOperation>({
    data,
    method: 'POST',
    url: '/inventory/operation'
  });

/**
 * 获取库存操作记录
 *
 * @param params 查询参数：分页、商品编号等
 */
export const fetchInventoryOperations = (params: {
  page: number;
  pageSize: number;
  productNo?: string;
  type?: string;
}) =>
  request<InventoryOperationListResponse>({
    method: 'GET',
    params,
    url: '/inventory/operations'
  });
