import React, { useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';

interface Order {
  id: number;
  orderNo: string;
  customer: string;
  amount: number;
  status: '待支付' | '已支付' | '已发货' | '已完成' | '已取消';
  createdAt: string;
}

const initialOrders: Order[] = [
  { id: 1, orderNo: '20240601001', customer: '张三', amount: 199, status: '待支付', createdAt: '2024-06-01 10:00' },
  { id: 2, orderNo: '20240601002', customer: '李四', amount: 299, status: '已支付', createdAt: '2024-06-01 11:00' }
];

const statusColor: Record<Order['status'], string> = {
  '待支付': 'orange',
  '已支付': 'blue',
  '已发货': 'purple',
  '已完成': 'green',
  '已取消': 'red'
};

const OrderManage: React.FC = () => {
  const [orders] = useState<Order[]>(initialOrders);

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (v: number) => `￥${v}` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: Order['status']) => <Tag color={statusColor[v]}>{v}</Tag> },
    { title: '下单时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
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
          <SvgIcon icon="ant-design:profile-outlined" className="mr-8px" />
          订单管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-circle-outlined">
          新建订单
        </ButtonIcon>
      </div>
      <div className="bg-white rd-8px p-16px shadow-sm">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_order',
  icon: 'ant-design:profile-outlined',
  order: 3,
  title: '订单管理'
};

export default OrderManage; 
  