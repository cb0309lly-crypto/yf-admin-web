import { Button, Card, Form, Input, InputNumber, Modal, Select, Table, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';

import SvgIcon from '@/components/SvgIcon';
import {
  fetchInventoryByProduct,
  saveInventory,
  updateInventory
} from '@/service/api';
import type { Inventory } from '@/types/inventory';
import type { Product } from '@/types/product';

interface InventoryModalProps {
  onClose: () => void;
  open: boolean;
  product: Product | null;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ open, onClose, product }) => {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 获取库存信息
  const loadInventory = async () => {
    if (!product?.no) return;

    setLoading(true);
    try {
      const { data } = await fetchInventoryByProduct(product.no);
      setInventory(data);
      form.setFieldsValue(data);
    } catch (e) {
      message.error('获取库存信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && product) {
      loadInventory();
    }
  }, [open, product]);

  // 保存库存设置
  const handleSaveInventory = async () => {
    if (!product?.no) return;

    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        name: `${product.name}-库存`,
        productImgUrl: product.imgUrl,
        productName: product.name,
        productNo: product.no,
        unit: product.unit
      };

      if (inventory?.id) {
        await updateInventory({ ...data, id: inventory.id });
      } else {
        await saveInventory(data);
      }

      message.success('保存成功');
      loadInventory();
    } catch (e) {
      message.error('保存失败');
    }
  };


  const tabItems = [
    {
      key: 'settings',
      label: '库存设置',
      children: (
        <Form form={form} layout="vertical">
          <Form.Item
            label="当前库存"
            name="quantity"
            rules={[{ required: true, message: '请输入当前库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="最小库存预警"
            name="minStock"
            rules={[{ required: true, message: '请输入最小库存预警' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="最大库存限制"
            name="maxStock"
            rules={[{ required: true, message: '请输入最大库存限制' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="库存位置"
            name="location"
          >
            <Input placeholder="请输入库存位置" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      )
    },

  ];

  return (
    <Modal
      title={
        <div className="flex-y-center">
          <SvgIcon
            className="mr-8px"
            icon="ant-design:inbox-outlined"
          />
          库存管理 - {product?.name}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          关闭
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveInventory}>
          保存设置
        </Button>
      ]}
    >
      <div className="mb-16px">
        <div className="flex-y-center">
          {product?.imgUrl && (
            <img
              alt="商品图片"
              src={product.imgUrl}
              style={{ borderRadius: 4, height: 48, marginRight: 12, objectFit: 'cover', width: 48 }}
            />
          )}
          <div>
            <div className="text-16px font-bold">{product?.name}</div>
            <div className="text-14px text-#666">商品编号: {product?.no}</div>
            <div className="text-14px text-#666">当前库存: {inventory?.currentStock || 0} {product?.unit}</div>
          </div>
        </div>
      </div>

      <Tabs items={tabItems} />
    </Modal>
  );
};

export default InventoryModal;
