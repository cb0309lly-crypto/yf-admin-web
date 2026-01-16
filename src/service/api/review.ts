import { request } from '@/service/request';
import type { Review, ReviewListResponse } from '@/types/review';

export const fetchReviewList = (params: {
  keyword?: string;
  page: number;
  pageSize: number;
  rating?: number;
  status?: string;
}) =>
  request<ReviewListResponse>({
    method: 'GET',
    params,
    url: '/review/list'
  });

export const updateReviewStatus = (id: string, status: string) =>
  request({
    data: { status },
    method: 'PUT',
    url: `/review/${id}`
  });

export const adminReplyReview = (id: string, reply: string) =>
  request({
    data: { reply },
    method: 'POST',
    url: `/review/${id}/reply`
  });

export const deleteReview = (id: string) =>
  request({
    method: 'DELETE',
    url: `/review/${id}`
  });
