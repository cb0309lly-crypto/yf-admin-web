import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';

import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';
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
    { dataIndex: 'roleName', key: 'roleName', title: '角色名称' },
    { dataIndex: 'roleCode', key: 'roleCode', title: '角色编码' },
    { dataIndex: 'roleDesc', key: 'roleDesc', title: '描述' },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '1' ? 'green' : 'red'}>{status === '1' ? '启用' : '禁用'}</Tag>
      ),
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any) => (
        <Space>
          <Button
            disabled
            type="link"
          >
            编辑
          </Button>
          <Button
            danger
            disabled
            type="link"
          >
            删除
          </Button>
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
            icon="ant-design:safety-certificate-outlined"
          />
          角色管理
        </h2>
        <ButtonIcon
          icon="ant-design:plus-outlined"
          type="primary"
        >
          新增角色
        </ButtonIcon>
      </div>

      <div className="mb-16px rd-8px bg-white p-16px shadow-sm">
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item
            label="角色名称"
            name="roleName"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
          >
            <Select
              allowClear
              placeholder="请选择"
              style={{ width: 120 }}
            >
              <Select.Option value="1">启用</Select.Option>
              <Select.Option value="0">禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
            >
              查询
            </Button>
            <Button
              className="ml-8px"
              onClick={() => {
                searchForm.resetFields();
                handleSearch();
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="rd-8px bg-white p-16px shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
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
