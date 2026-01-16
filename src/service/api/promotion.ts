import { request } from '@/service/request';
import type { Promotion, PromotionListResponse } from '@/types/promotion';

export const fetchPromotionList = (params: {
  keyword?: string;
  page: number;
  pageSize: number;
  status?: string;
  type?: string;
}) =>
  request<PromotionListResponse>({
    method: 'GET',
    params,
    url: '/promotion/list'
  });

export const fetchActivePromotions = () =>
  request<Promotion[]>({
    method: 'GET',
    url: '/promotion/active/list'
  });

export const createPromotion = (data: Partial<Promotion>) =>
  request<Promotion>({
    data,
    method: 'POST',
    url: '/promotion'
  });

export const updatePromotion = (id: string, data: Partial<Promotion>) =>
  request<Promotion>({
    data,
    method: 'PUT',
    url: `/promotion/${id}`
  });

export const deletePromotion = (id: string) =>
  request({
    method: 'DELETE',
    url: `/promotion/${id}`
  });
