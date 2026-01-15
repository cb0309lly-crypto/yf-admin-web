import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import OrderCreateModal from '@/components/OrderCreateModal';
import SvgIcon from '@/components/SvgIcon';
import { deleteOrder, fetchOrderDetail, fetchOrderList, updateOrder, updateOrderStatus } from '@/service/api/order';
import type { Order, OrderQueryParams, OrderStatus } from '@/types/order';

const PAGE_SIZE = 8;

// 订单状态选项
const ORDER_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已下单', value: '已下单' },
  { label: '未付款', value: '未付款' },
  { label: '已付款', value: '已付款' },
  { label: '已取消', value: '已取消' },
  { label: '已配送', value: '已配送' },
  { label: '异常单', value: '异常单' }
];

const statusColor: Record<OrderStatus, string> = {
  已下单: 'blue',
  已付款: 'green',
  已取消: 'red',
  已配送: 'purple',
  异常单: 'gray',
  未付款: 'orange'
};

const OrderManage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form] = Form.useForm();
  const isEdit = Boolean(editing);
  const lastQuery = useRef({ page: 1, pageSize: PAGE_SIZE });
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState<OrderQueryParams>({
    customerNo: '',
    keyword: '',
    operatorNo: '',
    orderStatus: '',
    page: 1,
    pageSize: PAGE_SIZE,
    userNo: ''
  });

  // 获取订单列表
  const loadOrders = async (page = 1, pageSize = PAGE_SIZE, params = searchParams) => {
    setLoading(true);
    try {
      const response = await fetchOrderList({ ...params, page, pageSize });
      // 根据后端响应格式调整
      const data = response?.data || response;
      setOrders(data?.list ?? data?.records ?? []);
      setPagination({
        current: page,
        pageSize,
        total: data?.total ?? data?.totalCount ?? 0
      });
      lastQuery.current = { page, pageSize };
    } catch (e: any) {
      console.error('error', e);
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, []);

  // 查询表单提交
  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setSearchParams(values);
    loadOrders(1, PAGE_SIZE, values);
  };

  // 打开新增/编辑弹窗
  const openModal = async (order?: Order) => {
    setEditing(order || null);
    setModalOpen(true);

    if (order) {
      // 获取详情
      const { data: detail } = await fetchOrderDetail(order.no);
      if (detail) {
        form.setFieldsValue({ ...detail });
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  };

  // 提交表单
  const handleOk = async (values: any) => {
    try {
      const submitData: Partial<Order> = {
        ...values
      };
      if (isEdit && editing) {
        submitData.no = editing.no;
        await updateOrder(submitData);
        message.success('订单编辑成功');
      } else {
        await createOrder(submitData);
        message.success('订单添加成功');
      }
      setModalOpen(false);
      loadOrders(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 删除订单
  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    message.success('订单已删除');
    loadOrders(pagination.current, pagination.pageSize);
  };

  // 更新订单状态
  const handleStatusChange = async (orderNo: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderNo, newStatus);
      message.success('订单状态更新成功');
      loadOrders(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('状态更新失败:', error);
    }
  };

  // 订单创建成功
  const handleOrderCreateSuccess = () => {
    loadOrders(pagination.current, pagination.pageSize);
  };

  const columns = [
    { dataIndex: 'no', key: 'no', title: '订单编号' },
    { dataIndex: 'userNo', key: 'userNo', title: '用户编号' },
    { dataIndex: 'shipAddress', key: 'shipAddress', title: '收货地址' },
    {
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      render: (v: number) => (v ? `¥${v.toFixed(2)}` : '-'),
      title: '订单总额'
    },
    {
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: OrderStatus) => <Tag color={statusColor[status]}>{status}</Tag>,
      title: '订单状态'
    },
    { dataIndex: 'description', key: 'description', title: '订单描述' },
    { dataIndex: 'remark', key: 'remark', title: '备注' },
    { dataIndex: 'operatorNo', key: 'operatorNo', title: '操作员编号' },
    { dataIndex: 'customerNo', key: 'customerNo', title: '客户编号' },
    { dataIndex: 'productNo', key: 'productNo', title: '商品编号' },
    { dataIndex: 'materialNo', key: 'materialNo', title: '物料编号' },
    { dataIndex: 'logisticsNo', key: 'logisticsNo', title: '物流编号' },
    { dataIndex: 'createdAt', key: 'createdAt', title: '创建时间' },
    {
      key: 'action',
      render: (_: any, record: Order) => (
        <Space>
          <Button
            icon={<SvgIcon icon="ant-design:eye-outlined" />}
            type="link"
            onClick={() => openModal(record)}
          >
            查看
          </Button>
          <Button
            icon={<SvgIcon icon="ant-design:edit-outlined" />}
            type="link"
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Select
            options={ORDER_STATUS_OPTIONS.filter(opt => opt.value !== '')}
            size="small"
            style={{ width: 100 }}
            value={record.orderStatus}
            onChange={value => handleStatusChange(record.no, value)}
          />
          <Popconfirm
            title="确定删除该订单吗？"
            onConfirm={() => handleDelete(record.no)}
          >
            <Button
              danger
              icon={<SvgIcon icon="ant-design:delete-outlined" />}
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
      <div className="mb-16px flex-y-center justify-between">
        <h2 className="flex-y-center text-20px font-bold">
          <SvgIcon
            className="mr-8px"
            icon="ant-design:profile-outlined"
          />
          订单管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-circle-outlined"
          type="primary"
          onClick={() => setModalOpen(true)}
        >
          添加订单
        </ButtonIcon>
      </div>
      {/* 查询表单 */}
      <Form
        className="mb-16px"
        form={searchForm}
        initialValues={searchParams}
        layout="inline"
        onFinish={handleSearch}
      >
        <Form.Item
          label="关键词"
          name="keyword"
        >
          <Input
            allowClear
            placeholder="请输入订单编号、收货地址等关键词"
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item
          label="用户编号"
          name="userNo"
        >
          <Input
            allowClear
            placeholder="请输入用户编号"
            style={{ width: 150 }}
          />
        </Form.Item>
        <Form.Item
          label="订单状态"
          name="orderStatus"
        >
          <Select
            allowClear
            options={ORDER_STATUS_OPTIONS}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item
          label="操作员编号"
          name="operatorNo"
        >
          <Input
            allowClear
            placeholder="请输入操作员编号"
            style={{ width: 150 }}
          />
        </Form.Item>
        <Form.Item
          label="客户编号"
          name="customerNo"
        >
          <Input
            allowClear
            placeholder="请输入客户编号"
            style={{ width: 150 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
          >
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="button"
            onClick={() => {
              searchForm.resetFields();
              setSearchParams({
                customerNo: '',
                keyword: '',
                operatorNo: '',
                orderStatus: '',
                page: 1,
                pageSize: PAGE_SIZE,
                userNo: ''
              });
              loadOrders(1, PAGE_SIZE, {
                customerNo: '',
                keyword: '',
                operatorNo: '',
                orderStatus: '',
                page: 1,
                pageSize: PAGE_SIZE,
                userNo: ''
              });
            }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
      {/* 表格区域 */}
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="no"
          pagination={{
            current: pagination.current,
            onChange: (page, pageSize) => loadOrders(page, pageSize, searchParams),
            pageSize: pagination.pageSize,
            showTotal: total => `共${total}条`,
            total: pagination.total
          }}
        />
      </div>
      {/* 订单创建弹窗 */}
      <OrderCreateModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleOrderCreateSuccess}
      />

      {/* 订单编辑弹窗 */}
      {editing && (
        <Modal
          closable
          destroyOnClose
          footer={null}
          open={Boolean(editing)}
          title="编辑订单"
          width={800}
          onCancel={() => setEditing(null)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOk}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="订单状态"
                name="orderStatus"
              >
                <Select placeholder="请选择订单状态">
                  {ORDER_STATUS_OPTIONS.filter(opt => opt.value !== '').map(opt => (
                    <Select.Option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="订单总额"
                name="orderTotal"
                rules={[{ message: '订单总额不能小于0', min: 0, type: 'number' }]}
              >
                <Input
                  placeholder="请输入订单总额"
                  step="0.01"
                  type="number"
                />
              </Form.Item>
              <Form.Item
                label="操作员编号"
                name="operatorNo"
              >
                <Input placeholder="请输入操作员编号" />
              </Form.Item>
              <Form.Item
                label="客户编号"
                name="customerNo"
              >
                <Input placeholder="请输入客户编号" />
              </Form.Item>
              <Form.Item
                label="商品编号"
                name="productNo"
              >
                <Input placeholder="请输入商品编号" />
              </Form.Item>
              <Form.Item
                label="物料编号"
                name="materialNo"
              >
                <Input placeholder="请输入物料编号" />
              </Form.Item>
              <Form.Item
                label="物流编号"
                name="logisticsNo"
              >
                <Input placeholder="请输入物流编号" />
              </Form.Item>
            </div>
            <Form.Item
              label="收货地址"
              name="shipAddress"
            >
              <Input.TextArea
                placeholder="请输入收货地址"
                rows={2}
              />
            </Form.Item>
            <Form.Item
              label="订单描述"
              name="description"
            >
              <Input.TextArea
                placeholder="请输入订单描述"
                rows={2}
              />
            </Form.Item>
            <Form.Item
              label="备注"
              name="remark"
            >
              <Input.TextArea
                placeholder="请输入备注"
                rows={2}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
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
