import { request } from '@/service/request';
import type { Coupon, CouponListResponse } from '@/types/coupon';

export const fetchCouponList = (params: {
  keyword?: string;
  page: number;
  pageSize: number;
  status?: string;
  type?: string;
}) =>
  request<CouponListResponse>({
    method: 'GET',
    params,
    url: '/coupon/list'
  });

export const createCoupon = (data: Partial<Coupon>) =>
  request<Coupon>({
    data,
    method: 'POST',
    url: '/coupon'
  });

export const updateCoupon = (id: string, data: Partial<Coupon>) =>
  request<Coupon>({
    data,
    method: 'PUT',
    url: `/coupon/${id}`
  });

export const deleteCoupon = (id: string) =>
  request({
    method: 'DELETE',
    url: `/coupon/${id}`
  });
