import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Card, Divider, Form, Input, Modal, Space, Table, message } from 'antd';
import React, { useState } from 'react';

import { fetchUserList } from '@/service/api/auth';
import { addToCart, fetchUserCart, removeFromCart, updateCartQuantity } from '@/service/api/cart';
import { createOrder } from '@/service/api/order';
import { createBatchOrderItems } from '@/service/api/order-item';
import { fetchProductList } from '@/service/api/product';
import type { Cart } from '@/types/cart';
import type { Order, OrderStatus } from '@/types/order';
import type { Product } from '@/types/product';
import { formatPrice, parseNumber } from '@/utils/number';

interface OrderCreateModalProps {
  onCancel: () => void;
  onSuccess: () => void;
  open: boolean;
}

interface CartItem extends Cart {
  product?: Product;
}

const OrderCreateModal: React.FC<OrderCreateModalProps> = ({ onCancel, onSuccess, open }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1); // 1: 选择用户, 2: 选择商品, 3: 确认订单

  // 用户选择相关状态
  const [users, setUsers] = useState<
    Array<{ authLogin?: string; avatar?: string; nickname: string; no: string; phone: string }>
  >([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    authLogin?: string;
    avatar?: string;
    nickname: string;
    no: string;
    phone: string;
  } | null>(null);

  // 商品选择相关状态
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // 购物车相关状态
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  // 订单总额
  const [orderTotal, setOrderTotal] = useState(0);

  // 重置状态
  const resetState = () => {
    setStep(1);
    setSelectedUser(null);
    setCartItems([]);
    setOrderTotal(0);
    form.resetFields();
  };

  // 关闭弹窗
  const handleCancel = () => {
    resetState();
    onCancel();
  };

  // 搜索用户
  const searchUsers = async (value: string) => {
    if (!value) {
      setUsers([]);
      return;
    }

    setUserLoading(true);
    try {
      const response = await fetchUserList({
        keyword: value,
        page: 1,
        pageSize: 20
      });
      const data = response?.data || response;
      setUsers(data?.list || []);
    } catch (error) {
      console.error('搜索用户失败:', error);
      message.error('搜索用户失败');
    } finally {
      setUserLoading(false);
    }
  };

  // 选择用户
  const handleUserSelect = (value: string, option: any) => {
    const user = users.find(u => u.no === value);
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({ userNo: value });
    }
  };

  // 搜索商品
  const searchProducts = async (value: string) => {
    if (!value) {
      setProducts([]);
      return;
    }

    setProductLoading(true);
    try {
      const response = await fetchProductList({
        keyword: value,
        page: 1,
        pageSize: 20
      });
      const data = response?.data || response;
      setProducts(data?.list || data?.records || []);
    } catch (error) {
      console.error('搜索商品失败:', error);
      message.error('搜索商品失败');
    } finally {
      setProductLoading(false);
    }
  };

  // 加载用户购物车
  const loadUserCart = async () => {
    if (!selectedUser) return;

    setCartLoading(true);
    try {
      const response = await fetchUserCart(selectedUser.no);
      const data = response?.data || response;

      // 使用后端返回的数据结构
      setCartItems(('items' in data && data?.items) || []);
      setOrderTotal(('totalPrice' in data && data?.totalPrice) || 0);
    } catch (error) {
      console.error('加载购物车失败:', error);
      message.error('加载购物车失败');
    } finally {
      setCartLoading(false);
    }
  };

  // 添加商品到购物车
  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    if (!selectedUser) {
      message.error('请先选择用户');
      return;
    }

    try {
      await addToCart({
        productNo: product.no,
        quantity,
        userNo: selectedUser.no
      });

      message.success('商品已添加到购物车');
      await loadUserCart();
    } catch (error) {
      console.error('添加商品失败:', error);
      message.error('添加商品失败');
    }
  };

  // 从购物车移除商品
  const handleRemoveFromCart = async (cartItem: CartItem) => {
    if (!selectedUser) return;

    try {
      await removeFromCart({
        productNo: cartItem.productNo,
        userNo: selectedUser.no
      });

      message.success('商品已从购物车移除');
      await loadUserCart();
    } catch (error) {
      console.error('移除商品失败:', error);
      message.error('移除商品失败');
    }
  };

  // 更新商品数量
  const handleUpdateQuantity = async (cartItem: CartItem, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveFromCart(cartItem);
      return;
    }

    try {
      await updateCartQuantity({
        id: cartItem.no,
        quantity
      });

      message.success('数量已更新');
      await loadUserCart();
    } catch (error) {
      console.error('更新数量失败:', error);
      message.error('更新数量失败');
    }
  };

  // 下一步
  const handleNext = () => {
    if (step === 1) {
      if (!selectedUser) {
        message.error('请选择用户');
        return;
      }
      setStep(2);
      loadUserCart();
    } else if (step === 2) {
      if (cartItems.length === 0) {
        message.error('请添加商品到购物车');
        return;
      }
      setStep(3);
    }
  };

  // 上一步
  const handlePrev = () => {
    setStep(step - 1);
  };

  // 提交订单
  const handleSubmit = async (values: any) => {
    if (!selectedUser || cartItems.length === 0) {
      message.error('请选择用户和商品');
      return;
    }

    try {
      // 创建订单
      const orderData: Partial<Order> = {
        customerNo: values.customerNo,
        description: values.description,
        logisticsNo: values.logisticsNo,
        operatorNo: values.operatorNo,
        orderStatus: '已下单' as OrderStatus,
        orderTotal,
        remark: values.remark,
        shipAddress: values.shipAddress,
        userNo: selectedUser.no
      };

      const orderResponse = await createOrder(orderData);
      const order = orderResponse?.data || orderResponse;

      // 创建订单项
      const orderItems = cartItems.map(item => ({
        discountAmount: 0,
        finalPrice: parseNumber(item.totalPrice),
        orderNo: 'no' in order ? order?.no : '',
        productNo: item.productNo,
        productSnapshot: item.product,
        quantity: item.quantity,
        status: 'pending' as any,
        totalPrice: parseNumber(item.totalPrice),
        unitPrice: parseNumber(item.unitPrice)
      }));

      // 批量创建订单项
      const batchResult = await createBatchOrderItems({ orderItems });
      console.log('批量创建订单项结果:', batchResult);

      if (!batchResult?.data?.success) {
        throw new Error('创建订单项失败');
      }

      message.success('订单创建成功');
      onSuccess();
      handleCancel();
    } catch (error) {
      console.error('创建订单失败:', error);
      message.error('创建订单失败');
    }
  };

  // 购物车表格列定义
  const cartColumns = [
    {
      key: 'product',
      render: (_: any, record: CartItem) => (
        <div className="flex items-center">
          {record.product?.imgUrl && (
            <img
              alt={record.product.name}
              className="mr-3 h-12 w-12 rounded object-cover"
              src={record.product.imgUrl}
            />
          )}
          <div>
            <div className="font-medium">{record.product?.name || '未知商品'}</div>
            <div className="text-sm text-gray-500">{record.product?.specs && `规格: ${record.product.specs}`}</div>
          </div>
        </div>
      ),
      title: '商品信息'
    },
    {
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: any) => formatPrice(price),
      title: '单价'
    },
    {
      key: 'quantity',
      render: (_: any, record: CartItem) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            size="small"
            onClick={() => handleUpdateQuantity(record, record.quantity - 1)}
          />
          <span className="w-12 text-center">{record.quantity}</span>
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handleUpdateQuantity(record, record.quantity + 1)}
          />
        </Space>
      ),
      title: '数量'
    },
    {
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: any) => formatPrice(price),
      title: '小计'
    },
    {
      key: 'action',
      render: (_: any, record: CartItem) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleRemoveFromCart(record)}
        >
          移除
        </Button>
      ),
      title: '操作'
    }
  ];

  return (
    <Modal
      destroyOnClose
      footer={null}
      open={open}
      title="创建订单"
      width={1000}
      onCancel={handleCancel}
    >
      <div className="space-y-6">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
              step >= 1 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
              step >= 2 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
              step >= 3 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            3
          </div>
        </div>

        {/* 步骤1: 选择用户 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">选择用户</h3>
            <Form.Item
              label="用户"
              name="userNo"
              rules={[{ message: '请选择用户', required: true }]}
            >
              <AutoComplete
                filterOption={false}
                loading={userLoading}
                placeholder="请搜索并选择用户"
                options={users.map(user => ({
                  label: `${user.nickname} - ${user.phone}${user.authLogin ? ` (${user.authLogin})` : ''}`,
                  value: user.no
                }))}
                onSearch={searchUsers}
                onSelect={handleUserSelect}
              />
            </Form.Item>
            {selectedUser && (
              <Card size="small">
                <div className="flex items-center space-x-4">
                  {selectedUser.avatar && (
                    <img
                      alt={selectedUser.nickname}
                      className="h-10 w-10 rounded-full object-cover"
                      src={selectedUser.avatar}
                    />
                  )}
                  <div>
                    <div className="font-medium">{selectedUser.nickname}</div>
                    <div className="text-sm text-gray-500">
                      {selectedUser.phone} {selectedUser.authLogin && `(${selectedUser.authLogin})`}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 步骤2: 选择商品 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">添加商品</h3>
            <div className="flex space-x-4">
              <AutoComplete
                className="flex-1"
                filterOption={false}
                loading={productLoading}
                placeholder="搜索商品..."
                options={products.map(product => ({
                  label: `${product.name} - ¥${product.price || 0} - ${product.status || '未知状态'}`,
                  value: product.no
                }))}
                onSearch={searchProducts}
                onSelect={value => {
                  const product = products.find(p => p.no === value);
                  if (product) {
                    handleAddToCart(product, 1);
                  }
                }}
              />
            </div>

            <Divider />

            <h4 className="font-medium">购物车 ({cartItems.length} 件商品)</h4>
            <Table
              columns={cartColumns}
              dataSource={cartItems}
              loading={cartLoading}
              pagination={false}
              rowKey="no"
              size="small"
            />

            <div className="text-right">
              <div className="text-lg font-medium">
                订单总额: <span className="text-red-500">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 步骤3: 确认订单 */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">确认订单信息</h3>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="收货地址"
                  name="shipAddress"
                  rules={[{ message: '请输入收货地址', required: true }]}
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
                  label="物流编号"
                  name="logisticsNo"
                >
                  <Input placeholder="请输入物流编号" />
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
              </div>

              <Divider />

              <div className="space-y-2">
                <h4 className="font-medium">订单商品</h4>
                <Table
                  columns={cartColumns}
                  dataSource={cartItems}
                  loading={cartLoading}
                  pagination={false}
                  rowKey="no"
                  size="small"
                />
                <div className="text-right">
                  <div className="text-lg font-medium">
                    订单总额: <span className="text-red-500">{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between">
          <div>{step > 1 && <Button onClick={handlePrev}>上一步</Button>}</div>
          <div className="space-x-2">
            <Button onClick={handleCancel}>取消</Button>
            {step < 3 ? (
              <Button
                type="primary"
                onClick={handleNext}
              >
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => form.submit()}
              >
                提交订单
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderCreateModal;
