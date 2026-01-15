import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message, DatePicker, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import ButtonIcon from '@/components/ButtonIcon';
import {
  fetchCouponList,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '@/service/api/coupon';
import type { Coupon } from '@/types/coupon';
import dayjs from 'dayjs';

const CouponManage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();
  const isEdit = Boolean(editing);

  const loadCoupons = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await fetchCouponList({ page, pageSize });
      setCoupons(data?.list ?? []);
      setPagination({ current: page, pageSize, total: data?.total ?? 0 });
    } catch (e) {
      message.error('获取优惠券失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openModal = (coupon?: Coupon) => {
    setEditing(coupon || null);
    setModalOpen(true);
    if (coupon) {
      form.setFieldsValue({
        ...coupon,
        range: [dayjs(coupon.validFrom), dayjs(coupon.validUntil)]
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = async (values: any) => {
    try {
      const { range, ...rest } = values;
      const submitData = {
        ...rest,
        validFrom: range[0].toISOString(),
        validUntil: range[1].toISOString()
      };
      
      if (isEdit && editing) {
        await updateCoupon(editing.no, submitData);
        message.success('更新成功');
      } else {
        await createCoupon(submitData);
        message.success('创建成功');
      }
      setModalOpen(false);
      loadCoupons(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCoupon(id);
    message.success('删除成功');
    loadCoupons(pagination.current, pagination.pageSize);
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '代码', dataIndex: 'code', key: 'code' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>
    },
    { 
      title: '面值', 
      dataIndex: 'value', 
      key: 'value',
      render: (val: number, record: Coupon) => record.type === 'percentage' ? `${val}%` : `¥${val}`
    },
    { 
      title: '门槛', 
      dataIndex: 'minimumAmount', 
      key: 'minimumAmount',
      render: (val: number) => `¥${val}`
    },
    { 
      title: '有效期', 
      key: 'validity',
      render: (_: any, record: Coupon) => (
        <div className="text-12px text-#666">
          {dayjs(record.validFrom).format('YYYY-MM-DD')} 至 {dayjs(record.validUntil).format('YYYY-MM-DD')}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Coupon) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.no)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex justify-between items-center">
        <h2 className="text-20px font-bold flex items-center">
          <SvgIcon icon="ant-design:gift-outlined" className="mr-8px" />
          优惠券管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-outlined" onClick={() => openModal()}>
          新增优惠券
        </ButtonIcon>
      </div>
      <div className="bg-white p-16px rd-8px shadow-sm">
        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="no"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => loadCoupons(page, pageSize),
            showTotal: (total) => `共${total}条`
          }}
        />
      </div>
      <Modal
        title={isEdit ? '编辑优惠券' : '新增优惠券'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <div className="grid grid-cols-2 gap-x-16px">
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="code" label="代码" rules={[{ required: true, message: '请输入代码' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="类型" initialValue="fixed_amount" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="fixed_amount">固定金额</Select.Option>
                <Select.Option value="percentage">百分比</Select.Option>
                <Select.Option value="free_shipping">免运费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="value" label="面值" initialValue={0} rules={[{ required: true }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="minimumAmount" label="最小订单金额" initialValue={0}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="usageLimit" label="使用限制次数" initialValue={1}>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Form.Item name="range" label="有效日期" rules={[{ required: true, message: '请选择有效期' }]} className="col-span-2">
              <DatePicker.RangePicker className="w-full" />
            </Form.Item>
            <Form.Item name="isGlobal" label="是否通用" valuePropName="checked" initialValue={false}>
              <Select>
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue="active">
              <Select>
                <Select.Option value="active">激活</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_coupon',
  icon: 'ant-design:gift-outlined',
  order: 5,
  title: '优惠券管理'
};

export default CouponManage;

