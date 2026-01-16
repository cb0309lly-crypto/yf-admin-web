import { request } from '@/service/request';

/**
 * 获取看板卡片数据
 */
export function fetchCardData() {
  return request<{
    dealCount: number;
    downloadCount: number;
    turnover: number;
    visitCount: number;
  }>({
    url: '/stats/card-data',
    method: 'get'
  });
}

/**
 * 获取折线图数据
 */
export function fetchLineChartData() {
  return request<any[]>({
    url: '/stats/line-chart',
    method: 'get'
  });
}

/**
 * 获取饼图数据
 */
export function fetchPieChartData() {
  return request<any[]>({
    url: '/stats/pie-chart',
    method: 'get'
  });
}
