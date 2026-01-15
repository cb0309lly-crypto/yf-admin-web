import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message, DatePicker, InputNumber, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import ButtonIcon from '@/components/ButtonIcon';
import {
  fetchPromotionList,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '@/service/api/promotion';
import type { Promotion } from '@/types/promotion';
import dayjs from 'dayjs';

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
        startDate: range[0].toISOString(),
        endDate: range[1].toISOString()
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
    { title: '名称', dataIndex: 'name', key: 'name' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: '优惠额度', 
      dataIndex: 'discountValue', 
      key: 'discountValue',
      render: (val: number) => `¥${val}`
    },
    { 
      title: '周期', 
      key: 'period',
      render: (_: any, record: Promotion) => (
        <div className="text-12px text-#666">
          {dayjs(record.startDate).format('YYYY-MM-DD')} 至 {dayjs(record.endDate).format('YYYY-MM-DD')}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = { active: 'green', paused: 'orange', draft: 'default', ended: 'red' };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Promotion) => (
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
          <SvgIcon icon="ant-design:fire-outlined" className="mr-8px" />
          促销管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-outlined" onClick={() => openModal()}>
          新增促销
        </ButtonIcon>
      </div>
      <div className="bg-white p-16px rd-8px shadow-sm">
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="no"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => loadPromotions(page, pageSize),
            showTotal: (total) => `共${total}条`
          }}
        />
      </div>
      <Modal
        title={isEdit ? '编辑促销' : '新增促销'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <div className="grid grid-cols-2 gap-x-16px">
            <Form.Item name="name" label="促销名称" rules={[{ required: true, message: '请输入促销名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="类型" initialValue="discount" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="discount">折扣</Select.Option>
                <Select.Option value="buy_one_get_one">买一送一</Select.Option>
                <Select.Option value="flash_sale">限时秒杀</Select.Option>
                <Select.Option value="free_shipping">免运费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="discountValue" label="优惠数值" initialValue={0}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="priority" label="优先级" initialValue={0}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="range" label="活动周期" rules={[{ required: true, message: '请选择周期' }]} className="col-span-2">
              <DatePicker.RangePicker className="w-full" showTime />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue="draft">
              <Select>
                <Select.Option value="draft">草稿</Select.Option>
                <Select.Option value="active">启用</Select.Option>
                <Select.Option value="paused">暂停</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="isFeatured" label="是否精选" valuePropName="checked">
              <Switch />
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
  i18nKey: 'route.(base)_function_promotion',
  icon: 'ant-design:fire-outlined',
  order: 6,
  title: '促销管理'
};

export default PromotionManage;

