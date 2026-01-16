import { request } from '@/service/request';
import type { Api } from '@/types/api';

/**
 * 申请退款 (仅供参考，主要是移动端调用)
 */
export function applyRefund(data: any) {
  return request({
    url: '/refund/apply',
    method: 'post',
    data
  });
}

/**
 * 审核退款
 */
export function auditRefund(refundNo: string, data: { status: string; adminRemark?: string }) {
  return request({
    url: `/refund/audit/${refundNo}`,
    method: 'put',
    data
  });
}

/**
 * 获取退款列表
 */
export function fetchRefundList(params?: any) {
  return request<{ list: any[]; total: number }>({
    url: '/refund/list',
    method: 'get',
    params
  });
}
