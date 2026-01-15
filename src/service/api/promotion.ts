import { request } from '@/service/request';
import type { Promotion, PromotionListResponse } from '@/types/promotion';

export const fetchPromotionList = (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  type?: string;
}) =>
  request<PromotionListResponse>({
    url: '/promotion/list',
    method: 'GET',
    params,
  });

export const fetchActivePromotions = () =>
  request<Promotion[]>({
    url: '/promotion/active/list',
    method: 'GET',
  });

export const createPromotion = (data: Partial<Promotion>) =>
  request<Promotion>({
    url: '/promotion',
    method: 'POST',
    data,
  });

export const updatePromotion = (id: string, data: Partial<Promotion>) =>
  request<Promotion>({
    url: `/promotion/${id}`,
    method: 'PUT',
    data,
  });

export const deletePromotion = (id: string) =>
  request({
    url: `/promotion/${id}`,
    method: 'DELETE',
  });

