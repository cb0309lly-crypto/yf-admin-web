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
  Switch,
  Table,
  Tag,
  message
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';
import { createPromotion, deletePromotion, fetchPromotionList, updatePromotion } from '@/service/api/promotion';
import type { Promotion } from '@/types/promotion';

const PromotionManage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();
  const isEdit = Boolean(editing);

  const loadPromotions = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await fetchPromotionList({ page, pageSize });
      setPromotions(data?.list ?? []);
      setPagination({ current: page, pageSize, total: data?.total ?? 0 });
    } catch (e) {
      message.error('获取促销活动失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const openModal = (promotion?: Promotion) => {
    setEditing(promotion || null);
    setModalOpen(true);
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        range: [dayjs(promotion.startDate), dayjs(promotion.endDate)]
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
        endDate: range[1].toISOString(),
        startDate: range[0].toISOString()
      };

      if (isEdit && editing) {
        await updatePromotion(editing.no, submitData);
        message.success('更新成功');
      } else {
        await createPromotion(submitData);
        message.success('创建成功');
      }
      setModalOpen(false);
      loadPromotions(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    await deletePromotion(id);
    message.success('删除成功');
    loadPromotions(pagination.current, pagination.pageSize);
  };

  const columns = [
    { dataIndex: 'name', key: 'name', title: '名称' },
    {
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
      title: '类型'
    },
    {
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (val: number) => `¥${val}`,
      title: '优惠额度'
    },
    {
      key: 'period',
      render: (_: any, record: Promotion) => (
        <div className="text-12px text-#666">
          {dayjs(record.startDate).format('YYYY-MM-DD')} 至 {dayjs(record.endDate).format('YYYY-MM-DD')}
        </div>
      ),
      title: '周期'
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = { active: 'green', draft: 'default', ended: 'red', paused: 'orange' };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any, record: Promotion) => (
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
            icon="ant-design:fire-outlined"
          />
          促销管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-outlined"
          type="primary"
          onClick={() => openModal()}
        >
          新增促销
        </ButtonIcon>
      </div>
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={promotions}
          loading={loading}
          rowKey="no"
          pagination={{
            current: pagination.current,
            onChange: (page, pageSize) => loadPromotions(page, pageSize),
            pageSize: pagination.pageSize,
            showTotal: total => `共${total}条`,
            total: pagination.total
          }}
        />
      </div>
      <Modal
        destroyOnClose
        open={modalOpen}
        title={isEdit ? '编辑促销' : '新增促销'}
        width={700}
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
              label="促销名称"
              name="name"
              rules={[{ message: '请输入促销名称', required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue="discount"
              label="类型"
              name="type"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="discount">折扣</Select.Option>
                <Select.Option value="buy_one_get_one">买一送一</Select.Option>
                <Select.Option value="flash_sale">限时秒杀</Select.Option>
                <Select.Option value="free_shipping">免运费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={0}
              label="优惠数值"
              name="discountValue"
            >
              <InputNumber
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item
              initialValue={0}
              label="优先级"
              name="priority"
            >
              <InputNumber
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item
              className="col-span-2"
              label="活动周期"
              name="range"
              rules={[{ message: '请选择周期', required: true }]}
            >
              <DatePicker.RangePicker
                showTime
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              initialValue="draft"
              label="状态"
              name="status"
            >
              <Select>
                <Select.Option value="draft">草稿</Select.Option>
                <Select.Option value="active">启用</Select.Option>
                <Select.Option value="paused">暂停</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="是否精选"
              name="isFeatured"
              valuePropName="checked"
            >
              <Switch />
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
  i18nKey: 'route.(base)_function_promotion',
  icon: 'ant-design:fire-outlined',
  order: 6,
  title: '促销管理'
};

export default PromotionManage;
