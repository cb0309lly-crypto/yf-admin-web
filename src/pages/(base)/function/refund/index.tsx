import { Button, Form, Input, Modal, Select, Space, Table, Tag, message, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import { fetchRefundList, auditRefund } from '@/service/api/refund';
import dayjs from 'dayjs';

const RefundManage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchForm] = Form.useForm();
  
  // Audit Modal
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [currentRefund, setCurrentRefund] = useState<any>(null);
  const [auditForm] = Form.useForm();

  const loadData = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const { data: res } = await fetchRefundList({
        page: current,
        pageSize,
        ...values
      });
      if (res) {
        setData(res.list);
        setPagination({ current, pageSize, total: res.total });
      }
    } catch (e) {
      message.error('获取退款列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    loadData(1, pagination.pageSize);
  };

  const handleAudit = (record: any) => {
    setCurrentRefund(record);
    auditForm.resetFields();
    setAuditModalVisible(true);
  };

  const handleAuditSubmit = async () => {
    try {
      const values = await auditForm.validateFields();
      await auditRefund(currentRefund.refundNo, values);
      message.success('审核完成');
      setAuditModalVisible(false);
      loadData(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '退款编号', dataIndex: 'refundNo', key: 'refundNo' },
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '用户ID', dataIndex: 'userNo', key: 'userNo' },
    { title: '退款金额', dataIndex: 'amount', key: 'amount', render: (val: number) => `¥${val}` },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (val: string) => (val === 'return_goods' ? '退货退款' : '仅退款')
    },
    { title: '申请原因', dataIndex: 'reason', key: 'reason' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        let text = status;
        switch(status) {
          case 'pending': color = 'orange'; text = '待审核'; break;
          case 'approved': color = 'green'; text = '已同意'; break;
          case 'rejected': color = 'red'; text = '已拒绝'; break;
          case 'completed': color = 'green'; text = '已完成'; break;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { 
      title: '申请时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'pending' && (
            <Button type="link" onClick={() => handleAudit(record)}>审核</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex justify-between items-center">
        <h2 className="text-20px font-bold flex items-center">
          <SvgIcon icon="ant-design:money-collect-outlined" className="mr-8px" />
          售后管理
        </h2>
      </div>
      
      <div className="bg-white p-16px rd-8px shadow-sm mb-16px">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已同意</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className="ml-8px" onClick={() => {
              searchForm.resetFields();
              handleSearch();
            }}>重置</Button>
          </Form.Item>
        </Form>
      </div>

      <div className="bg-white p-16px rd-8px shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="refundNo"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => loadData(page, pageSize),
            showTotal: total => `共 ${total} 条`
          }}
        />
      </div>

      <Modal
        title="退款审核"
        open={auditModalVisible}
        onCancel={() => setAuditModalVisible(false)}
        onOk={handleAuditSubmit}
        destroyOnClose
      >
        <Form form={auditForm} layout="vertical">
          <div className="mb-4">
            <p><strong>退款金额：</strong> ¥{currentRefund?.amount}</p>
            <p><strong>申请原因：</strong> {currentRefund?.reason}</p>
            <p><strong>描述：</strong> {currentRefund?.description || '无'}</p>
            {currentRefund?.images && currentRefund.images.length > 0 && (
               <div className="mt-2">
                 <p><strong>凭证图片：</strong></p>
                 <div className="flex gap-2 mt-1">
                   {currentRefund.images.map((img: string, idx: number) => (
                     <Image key={idx} src={img} width={80} height={80} />
                   ))}
                 </div>
               </div>
            )}
          </div>
          <Form.Item name="status" label="审核结果" rules={[{ required: true, message: '请选择结果' }]}>
            <Select placeholder="请选择">
              <Select.Option value="approved">同意退款</Select.Option>
              <Select.Option value="rejected">拒绝退款</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="adminRemark" label="处理备注">
            <Input.TextArea placeholder="请输入备注（拒绝时必填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_refund',
  icon: 'ant-design:money-collect-outlined',
  order: 5,
  title: '售后管理'
};

export default RefundManage;
