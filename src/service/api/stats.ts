import { request } from '@/service/request';

export interface CardData {
  visitCount: number;
  turnover: number;
  downloadCount: number;
  dealCount: number;
}

export const fetchCardData = () =>
  request<CardData>({
    url: '/stats/card-data',
    method: 'GET',
  });

