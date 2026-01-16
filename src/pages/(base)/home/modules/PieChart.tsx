import { useTranslation } from 'react-i18next';
import { useEcharts } from '@/hooks/common/echarts';
import { useLang } from '@/features/lang';
import { useMount, useUpdateEffect } from 'ahooks';
import { fetchPieChartData } from '@/service/api/stats';

const PieChart = () => {
  const { t } = useTranslation();

  const { locale } = useLang();

  const { domRef, updateOptions } = useEcharts(() => ({
    legend: {
      bottom: '1%',
      itemStyle: {
        borderWidth: 0
      },
      left: 'center'
    },
    series: [
      {
        avoidLabelOverlap: false,
        color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
        data: [] as { name: string; value: number }[],
        emphasis: {
          label: {
            fontSize: '12',
            show: true
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 1
        },
        label: {
          position: 'center',
          show: false
        },
        labelLine: {
          show: false
        },
        name: '订单状态分布',
        radius: ['45%', '75%'],
        type: 'pie'
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  }));

  async function mockData() {
    const { data } = await fetchPieChartData();
    if (data) {
      updateOptions(opts => {
        opts.series[0].data = data;
        return opts;
      });
    }
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory();
      opts.series[0].name = originOpts.series[0].name;
      return opts;
    });
  }

  async function init() {
    mockData();
  }

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

export default PieChart;
