import { Button, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';

interface Logistics {
  company: string;
  id: number;
  logisticsNo: string;
  orderNo: string;
  status: '已取消' | '已签收' | '异常' | '运输中';
  updatedAt: string;
}

const initialLogistics: Logistics[] = [
  {
    company: '顺丰',
    id: 1,
    logisticsNo: 'L20240601001',
    orderNo: '20240601001',
    status: '运输中',
    updatedAt: '2024-06-01 12:00'
  },
  {
    company: '中通',
    id: 2,
    logisticsNo: 'L20240601002',
    orderNo: '20240601002',
    status: '已签收',
    updatedAt: '2024-06-01 13:00'
  }
];

const statusColor: Record<Logistics['status'], string> = {
  已取消: 'orange',
  已签收: 'green',
  异常: 'red',
  运输中: 'blue'
};

const LogisticsManage: React.FC = () => {
  const [logistics] = useState<Logistics[]>(initialLogistics);

  const columns = [
    { dataIndex: 'logisticsNo', key: 'logisticsNo', title: '物流单号' },
    { dataIndex: 'orderNo', key: 'orderNo', title: '订单号' },
    { dataIndex: 'company', key: 'company', title: '物流公司' },
    {
      dataIndex: 'status',
      key: 'status',
      render: (v: Logistics['status']) => <Tag color={statusColor[v]}>{v}</Tag>,
      title: '状态'
    },
    { dataIndex: 'updatedAt', key: 'updatedAt', title: '更新时间' },
    {
      key: 'action',
      render: (_: any, record: Logistics) => (
        <Space>
          <Button
            icon={<SvgIcon icon="ant-design:eye-outlined" />}
            type="link"
          >
            查看
          </Button>
          <Button
            icon={<SvgIcon icon="ant-design:edit-outlined" />}
            type="link"
          >
            编辑
          </Button>
          <Button
            danger
            icon={<SvgIcon icon="ant-design:delete-outlined" />}
            type="link"
          >
            删除
          </Button>
        </Space>
      ),
      title: '操作'
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex-y-center justify-between">
        <h2 className="flex-y-center text-20px font-bold">
          <SvgIcon
            className="mr-8px"
            icon="ant-design:car-outlined"
          />
          物流管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-circle-outlined"
          type="primary"
        >
          新建物流单
        </ButtonIcon>
      </div>
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={logistics}
          pagination={{ pageSize: 8 }}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_logistics',
  icon: 'ant-design:car-outlined',
  order: 4,
  title: '物流管理'
};

export default LogisticsManage;
