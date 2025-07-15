import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useRef, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';
import {
  createProduct,
  deleteProduct,
  fetchProductDetail,
  fetchProductList,
  updateProduct
} from '@/service/api/product';
import type { Product } from '@/types/product';

const PAGE_SIZE = 8;

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// 商品状态枚举
const PRODUCT_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已上架', value: '已上架' },
  { label: '已下架', value: '已下架' },
  { label: '缺货', value: '缺货' },
  { label: '有货', value: '有货' },
  { label: '售罄', value: '售罄' }
];
// 分类静态数据（如需动态可后续对接）
const CATEGORY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '食品', value: 'food' },
  { label: '服装', value: 'clothes' },
  { label: '数码', value: 'digital' }
];

const ProductManage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const isEdit = Boolean(editing);
  const lastQuery = useRef({ page: 1, pageSize: PAGE_SIZE });
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ categoryNo: '', keyword: '', status: '' });

  // 获取商品列表
  const loadProducts = async (page = 1, pageSize = PAGE_SIZE, params = searchParams) => {
    setLoading(true);
    try {
      const { data } = await fetchProductList({ page, pageSize, ...params });
      setProducts(data?.list ?? []);
      setPagination({ current: page, pageSize, total: data?.total ?? 0 });
      lastQuery.current = { page, pageSize };
    } catch (e) {
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, []);

  // 查询表单提交
  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setSearchParams(values);
    loadProducts(1, PAGE_SIZE, values);
  };

  // 打开新增/编辑弹窗
  const openModal = async (product?: Product) => {
    setEditing(product || null);
    setModalOpen(true);
    if (product) {
      // 获取详情（如需）
      const { data: detail } = await fetchProductDetail(product.no);
      if (detail) {
        form.setFieldsValue({ ...detail });
        if (detail.imgUrl) {
          setFileList([
            {
              name: 'image.png',
              status: 'done',
              uid: '-1',
              url: detail.imgUrl
            }
          ]);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  // 提交表单
  const handleOk = async () => {
    console.log('form--------', form.getFieldsValue());
    try {
      const values = await form.validateFields();
      const imgUrl = fileList[0]?.url || fileList[0]?.thumbUrl || '';
      const submitData: Partial<Product> = {
        ...values,
        imgUrl
      };
      if (isEdit && editing) {
        submitData.no = editing.no;
        await updateProduct(submitData);
        message.success('商品编辑成功');
      } else {
        await createProduct(submitData);
        message.success('商品添加成功');
      }
      setModalOpen(false);
      loadProducts(pagination.current, pagination.pageSize);
    } catch {}
  };

  // 删除商品
  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    message.success('商品已删除');
    loadProducts(pagination.current, pagination.pageSize);
  };

  // 上传前处理，转base64
  const handleBeforeUpload = async (file: File) => {
    const base64 = await getBase64(file);
    setFileList([
      {
        name: file.name,
        status: 'done',
        uid: String(Date.now()),
        url: base64
      }
    ]);
    form.setFieldValue('imgUrl', base64);
    return false;
  };

  // 预览图片
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.thumbUrl as string));
    setPreviewOpen(true);
  };

  const columns = [
    {
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (img: string) =>
        img ? (
          <img
            alt="商品图片"
            src={img}
            style={{ borderRadius: 4, height: 48, objectFit: 'cover', width: 48 }}
          />
        ) : (
          <span className="text-#bbb">无</span>
        ),
      title: '图片'
    },
    { dataIndex: 'name', key: 'name', title: '商品名' },
    { dataIndex: 'price', key: 'price', render: (v: number) => `¥${v}`, title: '价格' },
    { dataIndex: 'unit', key: 'unit', title: '单位' },
    { dataIndex: 'tag', key: 'tag', title: '标签' },
    { dataIndex: 'status', key: 'status', title: '状态' },
    {
      key: 'action',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            icon={<SvgIcon icon="ant-design:edit-outlined" />}
            type="link"
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该商品吗？"
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
            icon="ant-design:shop-outlined"
          />
          商品管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-circle-outlined"
          type="primary"
          onClick={() => openModal()}
        >
          添加商品
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
          label="商品名"
          name="keyword"
        >
          <Input
            allowClear
            placeholder="请输入商品名关键词"
            style={{ width: 180 }}
          />
        </Form.Item>
        <Form.Item
          label="分类"
          name="categoryNo"
        >
          <Select
            allowClear
            options={CATEGORY_OPTIONS}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item
          label="状态"
          name="status"
        >
          <Select
            allowClear
            options={PRODUCT_STATUS_OPTIONS}
            style={{ width: 120 }}
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
              setSearchParams({ categoryNo: '', keyword: '', status: '' });
              loadProducts(1, PAGE_SIZE, { categoryNo: '', keyword: '', status: '' });
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
          dataSource={products}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            onChange: (page, pageSize) => loadProducts(page, pageSize, searchParams),
            pageSize: pagination.pageSize,
            showTotal: total => `共${total}条`,
            total: pagination.total
          }}
        />
      </div>
      <Modal
        destroyOnClose
        closable
        footer={null}
        open={modalOpen}
        title={isEdit ? '编辑商品' : '添加商品'}
        onCancel={() => setModalOpen(false)}
      >
        <Form
          form={form}
          initialValues={{ name: '', price: 0 }}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            label="商品图片"
            name="imgUrl"
          >
            <Upload
              beforeUpload={handleBeforeUpload}
              fileList={fileList}
              listType="picture-card"
              maxCount={1}
              showUploadList={{ showPreviewIcon: true }}
              onPreview={handlePreview}
              onRemove={() => {
                setFileList([]);
                form.setFieldValue('imgUrl', '');
              }}
            >
              {fileList.length >= 1 ? null : <div>上传</div>}
            </Upload>
            <Modal
              footer={null}
              open={previewOpen}
              onCancel={() => setPreviewOpen(false)}
            >
              <img
                alt="预览"
                src={previewImage}
                style={{ width: '100%' }}
              />
            </Modal>
          </Form.Item>
          <Form.Item
            label="商品名"
            name="name"
            rules={[{ message: '请输入商品名', required: true }]}
          >
            {' '}
            <Input />{' '}
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            rules={[{ message: '请输入价格', required: true }]}
          >
            {' '}
            <InputNumber
              className="w-full"
              min={0}
            />{' '}
          </Form.Item>
          <Form.Item
            label="单位"
            name="unit"
          >
            {' '}
            <Input />{' '}
          </Form.Item>
          <Form.Item
            label="标签"
            name="tag"
          >
            {' '}
            <Input />{' '}
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
          >
            {' '}
            <Input />{' '}
          </Form.Item>
          <Form.Item ><Button htmlType="submit" type="primary">保存</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_product',
  icon: 'ant-design:shop-outlined',
  order: 2,
  title: '商品管理'
};

export default ProductManage;
