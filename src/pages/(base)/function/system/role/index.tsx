import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import ButtonIcon from '@/components/ButtonIcon';
import { fetchGetRoleList } from '@/service/api/system-manage';
import type { Api } from '@/types/api';

const RoleManage: React.FC = () => {
  const [data, setData] = useState<Api.SystemManage.Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchForm] = Form.useForm();
  
  const loadData = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const { data: res } = await fetchGetRoleList({
        current,
        size: pageSize,
        ...values
      });
      if (res) {
        setData(res.records);
        setPagination({ current, pageSize, total: res.total });
      }
    } catch (e) {
      message.error('获取角色列表失败');
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

  const columns = [
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode' },
    { title: '描述', dataIndex: 'roleDesc', key: 'roleDesc' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '1' ? 'green' : 'red'}>
          {status === '1' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any) => (
        <Space>
          <Button type="link" disabled>编辑</Button>
          <Button type="link" danger disabled>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex justify-between items-center">
        <h2 className="text-20px font-bold flex items-center">
          <SvgIcon icon="ant-design:safety-certificate-outlined" className="mr-8px" />
          角色管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-outlined">
          新增角色
        </ButtonIcon>
      </div>
      
      <div className="bg-white p-16px rd-8px shadow-sm mb-16px">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="roleName" label="角色名称">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="1">启用</Select.Option>
              <Select.Option value="0">禁用</Select.Option>
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
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => loadData(page, pageSize),
            showTotal: total => `共 ${total} 条`
          }}
        />
      </div>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_system_role',
  icon: 'ant-design:safety-certificate-outlined',
  order: 1,
  title: '角色管理'
};

export default RoleManage;
