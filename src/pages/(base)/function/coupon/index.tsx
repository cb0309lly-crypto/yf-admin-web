import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';
import { createCoupon, deleteCoupon, fetchCouponList, updateCoupon } from '@/service/api/coupon';
import type { Coupon } from '@/types/coupon';

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
    { dataIndex: 'name', key: 'name', title: '名称' },
    { dataIndex: 'code', key: 'code', title: '代码' },
    {
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
      title: '类型'
    },
    {
      dataIndex: 'value',
      key: 'value',
      render: (val: number, record: Coupon) => (record.type === 'percentage' ? `${val}%` : `¥${val}`),
      title: '面值'
    },
    {
      dataIndex: 'minimumAmount',
      key: 'minimumAmount',
      render: (val: number) => `¥${val}`,
      title: '门槛'
    },
    {
      key: 'validity',
      render: (_: any, record: Coupon) => (
        <div className="text-12px text-#666">
          {dayjs(record.validFrom).format('YYYY-MM-DD')} 至 {dayjs(record.validUntil).format('YYYY-MM-DD')}
        </div>
      ),
      title: '有效期'
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'active' ? 'green' : 'orange'}>{status}</Tag>,
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any, record: Coupon) => (
        <Space>
          <Button
            type="link"
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.no)}
          >
            <Button
              danger
              type="link"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: '操作'
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex items-center justify-between">
        <h2 className="flex items-center text-20px font-bold">
          <SvgIcon
            className="mr-8px"
            icon="ant-design:gift-outlined"
          />
          优惠券管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-outlined"
          type="primary"
          onClick={() => openModal()}
        >
          新增优惠券
        </ButtonIcon>
      </div>
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={coupons}
          loading={loading}
          rowKey="no"
          pagination={{
            current: pagination.current,
            onChange: (page, pageSize) => loadCoupons(page, pageSize),
            pageSize: pagination.pageSize,
            showTotal: total => `共${total}条`,
            total: pagination.total
          }}
        />
      </div>
      <Modal
        destroyOnClose
        open={modalOpen}
        title={isEdit ? '编辑优惠券' : '新增优惠券'}
        width={600}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <div className="grid grid-cols-2 gap-x-16px">
            <Form.Item
              label="名称"
              name="name"
              rules={[{ message: '请输入名称', required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="代码"
              name="code"
              rules={[{ message: '请输入代码', required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue="fixed_amount"
              label="类型"
              name="type"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="fixed_amount">固定金额</Select.Option>
                <Select.Option value="percentage">百分比</Select.Option>
                <Select.Option value="free_shipping">免运费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={0}
              label="面值"
              name="value"
              rules={[{ required: true }]}
            >
              <InputNumber
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item
              initialValue={0}
              label="最小订单金额"
              name="minimumAmount"
            >
              <InputNumber
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item
              initialValue={1}
              label="使用限制次数"
              name="usageLimit"
            >
              <InputNumber
                className="w-full"
                min={1}
              />
            </Form.Item>
            <Form.Item
              className="col-span-2"
              label="有效日期"
              name="range"
              rules={[{ message: '请选择有效期', required: true }]}
            >
              <DatePicker.RangePicker className="w-full" />
            </Form.Item>
            <Form.Item
              initialValue={false}
              label="是否通用"
              name="isGlobal"
              valuePropName="checked"
            >
              <Select>
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              initialValue="active"
              label="状态"
              name="status"
            >
              <Select>
                <Select.Option value="active">激活</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            label="描述"
            name="description"
          >
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
