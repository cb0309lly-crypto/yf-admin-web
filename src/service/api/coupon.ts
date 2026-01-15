import { request } from '@/service/request';
import type { Coupon, CouponListResponse } from '@/types/coupon';

export const fetchCouponList = (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  type?: string;
}) =>
  request<CouponListResponse>({
    url: '/coupon/list',
    method: 'GET',
    params,
  });

export const createCoupon = (data: Partial<Coupon>) =>
  request<Coupon>({
    url: '/coupon',
    method: 'POST',
    data,
  });

export const updateCoupon = (id: string, data: Partial<Coupon>) =>
  request<Coupon>({
    url: `/coupon/${id}`,
    method: 'PUT',
    data,
  });

export const deleteCoupon = (id: string) =>
  request({
    url: `/coupon/${id}`,
    method: 'DELETE',
  });

