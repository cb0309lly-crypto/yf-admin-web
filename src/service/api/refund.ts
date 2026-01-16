import { request } from '@/service/request';
import type { Api } from '@/types/api';

/** 申请退款 (仅供参考，主要是移动端调用) */
export function applyRefund(data: any) {
  return request({
    data,
    method: 'post',
    url: '/refund/apply'
  });
}

/** 审核退款 */
export function auditRefund(refundNo: string, data: { adminRemark?: string; status: string }) {
  return request({
    data,
    method: 'put',
    url: `/refund/audit/${refundNo}`
  });
}

/** 获取退款列表 */
export function fetchRefundList(params?: any) {
  return request<{ list: any[]; total: number }>({
    method: 'get',
    params,
    url: '/refund/list'
  });
}
