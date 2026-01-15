import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import ButtonIcon from '@/components/ButtonIcon';
import {
  fetchCategoryList,
  fetchCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
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
      title: item.name,
      value: item.no,
      children: item.children ? formatTreeData(item.children) : []
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
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '级别', dataIndex: 'categoryLevel', key: 'categoryLevel', render: (level: number) => <Tag color="blue">{level}级</Tag> },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '激活' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Category) => (
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
          <SvgIcon icon="ant-design:appstore-outlined" className="mr-8px" />
          分类管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-outlined" onClick={() => openModal()}>
          新增分类
        </ButtonIcon>
      </div>
      <div className="bg-white p-16px rd-8px shadow-sm">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="no"
          loading={loading}
          pagination={false}
        />
      </div>
      <Modal
        title={isEdit ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="上级分类">
            <TreeSelect
              allowClear
              treeData={categoryTree}
              placeholder="请选择上级分类（可选）"
            />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">激活</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
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

