import React, { useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';

interface Logistics {
  id: number;
  logisticsNo: string;
  orderNo: string;
  company: string;
  status: '运输中' | '已签收' | '异常' | '已取消';
  updatedAt: string;
}

const initialLogistics: Logistics[] = [
  { id: 1, logisticsNo: 'L20240601001', orderNo: '20240601001', company: '顺丰', status: '运输中', updatedAt: '2024-06-01 12:00' },
  { id: 2, logisticsNo: 'L20240601002', orderNo: '20240601002', company: '中通', status: '已签收', updatedAt: '2024-06-01 13:00' }
];

const statusColor: Record<Logistics['status'], string> = {
  '运输中': 'blue',
  '已签收': 'green',
  '异常': 'red',
  '已取消': 'orange'
};

const LogisticsManage: React.FC = () => {
  const [logistics] = useState<Logistics[]>(initialLogistics);

  const columns = [
    { title: '物流单号', dataIndex: 'logisticsNo', key: 'logisticsNo' },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '物流公司', dataIndex: 'company', key: 'company' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: Logistics['status']) => <Tag color={statusColor[v]}>{v}</Tag> },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Logistics) => (
        <Space>
          <Button type="link" icon={<SvgIcon icon="ant-design:eye-outlined" />}>查看</Button>
          <Button type="link" icon={<SvgIcon icon="ant-design:edit-outlined" />}>编辑</Button>
          <Button type="link" danger icon={<SvgIcon icon="ant-design:delete-outlined" />}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="flex-y-center justify-between mb-16px">
        <h2 className="text-20px font-bold flex-y-center">
          <SvgIcon icon="ant-design:car-outlined" className="mr-8px" />
          物流管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-circle-outlined">
          新建物流单
        </ButtonIcon>
      </div>
      <div className="bg-white rd-8px p-16px shadow-sm">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={logistics}
          pagination={{ pageSize: 8 }}
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
  