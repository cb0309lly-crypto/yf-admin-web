import { useMount, useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';

import { useLang } from '@/features/lang';
import { useEcharts } from '@/hooks/common/echarts';
import { fetchLineChartData } from '@/service/api/stats';

const LineChart = () => {
  const { t } = useTranslation();

  const { locale } = useLang();

  const { domRef, updateOptions } = useEcharts(() => ({
    grid: {
      bottom: '3%',
      containLabel: true,
      left: '3%',
      right: '4%'
    },
    legend: {
      data: ['订单量']
    },
    series: [
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#8e9dff',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#8e9dff',
        data: [] as number[],
        emphasis: {
          focus: 'series'
        },
        name: '订单量',
        smooth: true,
        stack: 'Total',
        type: 'line'
      }
    ],
    tooltip: {
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        },
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      boundaryGap: false,
      data: [] as string[],
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  }));

  async function mockData() {
    const { data } = await fetchLineChartData();

    if (data) {
      updateOptions(opts => {
        opts.xAxis.data = data.map((item: any) => item.date);
        opts.series[0].data = data.map((item: any) => Number(item.count));
        return opts;
      });
    }
  }

  function init() {
    mockData();
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory();
      opts.legend.data = originOpts.legend.data;
      return opts;
    });
  }
  // init

  useMount(() => {
    init();
  });

  useUpdateEffect(() => {
    updateLocale();
  }, [locale]);
  return (
    <ACard
      className="card-wrapper"
      variant="borderless"
    >
      <div
        className="h-360px overflow-hidden"
        ref={domRef}
      />
    </ACard>
  );
};

export default LineChart;
