import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, TreeSelect, message } from 'antd';
import React, { useEffect, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';
import {
  createCategory,
  deleteCategory,
  fetchCategoryList,
  fetchCategoryTree,
  updateCategory
} from '@/service/api/category';
import type { Category } from '@/types/category';

const CategoryManage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const isEdit = Boolean(editing);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await fetchCategoryList({ page: 1, pageSize: 100 });
      setCategories(data?.list ?? []);

      const { data: treeData } = await fetchCategoryTree();
      setCategoryTree(formatTreeData(treeData || []));
    } catch (e) {
      message.error('获取分类失败');
    } finally {
      setLoading(false);
    }
  };

  const formatTreeData = (data: Category[]) => {
    return data.map(item => ({
      children: item.children ? formatTreeData(item.children) : [],
      title: item.name,
      value: item.no
    }));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category?: Category) => {
    setEditing(category || null);
    setModalOpen(true);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async (values: any) => {
    try {
      if (isEdit && editing) {
        await updateCategory(editing.no, values);
        message.success('更新成功');
      } else {
        await createCategory(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      loadCategories();
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    message.success('删除成功');
    loadCategories();
  };

  const columns = [
    { dataIndex: 'name', key: 'name', title: '名称' },
    {
      dataIndex: 'categoryLevel',
      key: 'categoryLevel',
      render: (level: number) => <Tag color="blue">{level}级</Tag>,
      title: '级别'
    },
    { dataIndex: 'sort', key: 'sort', title: '排序' },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? '激活' : '禁用'}</Tag>
      ),
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any, record: Category) => (
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
            icon="ant-design:appstore-outlined"
          />
          分类管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-outlined"
          type="primary"
          onClick={() => openModal()}
        >
          新增分类
        </ButtonIcon>
      </div>
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={false}
          rowKey="no"
        />
      </div>
      <Modal
        destroyOnClose
        open={modalOpen}
        title={isEdit ? '编辑分类' : '新增分类'}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ message: '请输入名称', required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="上级分类"
            name="parentId"
          >
            <TreeSelect
              allowClear
              placeholder="请选择上级分类（可选）"
              treeData={categoryTree}
            />
          </Form.Item>
          <Form.Item
            initialValue={0}
            label="排序"
            name="sort"
          >
            <Input type="number" />
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
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_category',
  icon: 'ant-design:appstore-outlined',
  order: 4,
  title: '分类管理'
};

export default CategoryManage;
