import { request } from '@/service/request';
import type { Review, ReviewListResponse } from '@/types/review';

export const fetchReviewList = (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  rating?: number;
}) =>
  request<ReviewListResponse>({
    url: '/review/list',
    method: 'GET',
    params,
  });

export const updateReviewStatus = (id: string, status: string) =>
  request({
    url: `/review/${id}`,
    method: 'PUT',
    data: { status },
  });

export const adminReplyReview = (id: string, reply: string) =>
  request({
    url: `/review/${id}/reply`,
    method: 'POST',
    data: { reply },
  });

export const deleteReview = (id: string) =>
  request({
    url: `/review/${id}`,
    method: 'DELETE',
  });

