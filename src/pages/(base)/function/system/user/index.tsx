import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';

import SvgIcon from '@/components/SvgIcon';
import { fetchGetAllRoles, fetchGetUserList } from '@/service/api/system-manage';
import { request } from '@/service/request';
import type { Api } from '@/types/api';

const UserManage: React.FC = () => {
  const [data, setData] = useState<Api.SystemManage.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchForm] = Form.useForm();

  // Role Modal
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [allRoles, setAllRoles] = useState<Api.SystemManage.AllRole[]>([]);
  const [roleForm] = Form.useForm();

  const loadData = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const { data: res } = await fetchGetUserList({
        current,
        size: pageSize,
        ...values
      });
      if (res) {
        setData(res.records);
        setPagination({ current, pageSize, total: res.total });
      }
    } catch (e) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    fetchGetAllRoles().then(res => {
      if (res.data) {
        setAllRoles(res.data);
      }
    });
  }, []);

  const handleSearch = () => {
    loadData(1, pagination.pageSize);
  };

  const handleEditRole = (record: Api.SystemManage.User) => {
    setCurrentUserId(record.id);
    roleForm.setFieldsValue({ roleCodes: record.userRoles });
    setRoleModalVisible(true);
  };

  const handleRoleSubmit = async () => {
    try {
      const values = await roleForm.validateFields();
      if (currentUserId) {
        await request({
          data: {
            roleCodes: values.roleCodes,
            userId: currentUserId
          },
          method: 'post',
          url: '/systemManage/updateUserRole'
        });
        message.success('更新角色成功');
        setRoleModalVisible(false);
        loadData(pagination.current, pagination.pageSize);
      }
    } catch (e) {
      message.error('操作失败');
    }
  };

  const columns = [
    { dataIndex: 'userName', key: 'userName', title: '用户名' },
    { dataIndex: 'nickName', key: 'nickName', title: '昵称' },
    { dataIndex: 'userPhone', key: 'userPhone', title: '手机号' },
    {
      dataIndex: 'userRoles',
      key: 'userRoles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => {
            const roleName = allRoles.find(r => r.roleCode === role)?.roleName || role;
            return (
              <Tag
                color="blue"
                key={role}
              >
                {roleName}
              </Tag>
            );
          })}
        </Space>
      ),
      title: '角色'
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' || status === '1' ? 'green' : 'red'}>
          {status === 'active' || status === '1' ? '正常' : '禁用'}
        </Tag>
      ),
      title: '状态'
    },
    {
      key: 'action',
      render: (_: any, record: Api.SystemManage.User) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleEditRole(record)}
          >
            分配角色
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
            icon="ant-design:user-outlined"
          />
          用户管理
        </h2>
      </div>

      <div className="mb-16px rd-8px bg-white p-16px shadow-sm">
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item
            label="昵称"
            name="nickName"
          >
            <Input placeholder="请输入" />
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

      <Modal
        destroyOnClose
        open={roleModalVisible}
        title="分配角色"
        onCancel={() => setRoleModalVisible(false)}
        onOk={handleRoleSubmit}
      >
        <Form
          form={roleForm}
          layout="vertical"
        >
          <Form.Item
            label="角色"
            name="roleCodes"
            rules={[{ message: '请选择角色', required: true }]}
          >
            <Select
              mode="multiple"
              options={allRoles.map(r => ({ label: r.roleName, value: r.roleCode }))}
              placeholder="请选择角色"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_system_user',
  icon: 'ant-design:user-outlined',
  order: 2,
  title: '用户管理'
};

export default UserManage;
