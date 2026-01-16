import { Avatar, Button, Form, Input, Modal, Popconfirm, Rate, Select, Space, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import SvgIcon from '@/components/SvgIcon';
import { adminReplyReview, deleteReview, fetchReviewList, updateReviewStatus } from '@/service/api/review';
import type { Review } from '@/types/review';

const ReviewManage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [replying, setReplying] = useState<Review | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const loadReviews = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await fetchReviewList({ page, pageSize });
      setReviews(data?.list ?? []);
      setPagination({ current: page, pageSize, total: data?.total ?? 0 });
    } catch (e) {
      message.error('获取评价失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateReviewStatus(id, status);
    message.success('状态更新成功');
    loadReviews(pagination.current, pagination.pageSize);
  };

  const openReplyModal = (review: Review) => {
    setReplying(review);
    setModalOpen(true);
    form.setFieldsValue({ reply: review.adminReply });
  };

  const handleReplyOk = async (values: any) => {
    if (!replying) return;
    try {
      await adminReplyReview(replying.no, values.reply);
      message.success('回复成功');
      setModalOpen(false);
      loadReviews(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error('回复失败');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    message.success('删除成功');
    loadReviews(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      key: 'product',
      render: (_: any, record: Review) => (
        <div className="flex items-center">
          <span className="text-12px">{record.productNo}</span>
        </div>
      ),
      title: '商品'
    },
    {
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Rate
          disabled
          defaultValue={rating}
          style={{ fontSize: 14 }}
        />
      ),
      title: '评分'
    },
    {
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => <div className="max-w-200px truncate">{content}</div>,
      title: '内容'
    },
    {
      dataIndex: 'userNo',
      key: 'userNo',
      title: '评价人'
    },
    {
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
      title: '时间'
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Review) => (
        <Select
          size="small"
          value={status}
          options={[
            { label: '待审核', value: 'pending' },
            { label: '已通过', value: 'approved' },
            { label: '已拒绝', value: 'rejected' },
            { label: '隐藏', value: 'hidden' }
          ]}
          onChange={val => handleStatusChange(record.no, val)}
        />
      ),
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any, record: Review) => (
        <Space>
          <Button
            type="link"
            onClick={() => openReplyModal(record)}
          >
            回复
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
            icon="ant-design:comment-outlined"
          />
          评价管理
        </h2>
      </div>
      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={reviews}
          loading={loading}
          rowKey="no"
          pagination={{
            current: pagination.current,
            onChange: (page, pageSize) => loadReviews(page, pageSize),
            pageSize: pagination.pageSize,
            showTotal: total => `共${total}条`,
            total: pagination.total
          }}
        />
      </div>
      <Modal
        destroyOnClose
        open={modalOpen}
        title="回复评价"
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <div className="mb-16px rd-4px bg-#f5f5f5 p-12px">
          <div className="mb-4px font-bold">用户评价：</div>
          <div>{replying?.content}</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReplyOk}
        >
          <Form.Item
            label="管理回复"
            name="reply"
            rules={[{ message: '请输入回复内容', required: true }]}
          >
            <Input.TextArea
              placeholder="请输入回复内容..."
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_review',
  icon: 'ant-design:comment-outlined',
  order: 7,
  title: '评价管理'
};

export default ReviewManage;
