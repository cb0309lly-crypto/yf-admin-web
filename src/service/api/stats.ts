import { request } from '@/service/request';

/** 获取看板卡片数据 */
export function fetchCardData() {
  return request<{
    dealCount: number;
    downloadCount: number;
    turnover: number;
    visitCount: number;
  }>({
    method: 'get',
    url: '/stats/card-data'
  });
}

/** 获取折线图数据 */
export function fetchLineChartData() {
  return request<any[]>({
    method: 'get',
    url: '/stats/line-chart'
  });
}

/** 获取饼图数据 */
export function fetchPieChartData() {
  return request<any[]>({
    method: 'get',
    url: '/stats/pie-chart'
  });
}
