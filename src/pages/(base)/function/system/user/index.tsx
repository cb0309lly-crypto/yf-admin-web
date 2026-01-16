import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import { fetchGetUserList, fetchGetAllRoles } from '@/service/api/system-manage';
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
          url: '/systemManage/updateUserRole',
          method: 'post',
          data: {
            userId: currentUserId,
            roleCodes: values.roleCodes
          }
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
    { title: '用户名', dataIndex: 'userName', key: 'userName' },
    { title: '昵称', dataIndex: 'nickName', key: 'nickName' },
    { title: '手机号', dataIndex: 'userPhone', key: 'userPhone' },
    { 
      title: '角色', 
      dataIndex: 'userRoles', 
      key: 'userRoles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => {
            const roleName = allRoles.find(r => r.roleCode === role)?.roleName || role;
            return <Tag key={role} color="blue">{roleName}</Tag>;
          })}
        </Space>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' || status === '1' ? 'green' : 'red'}>
          {status === 'active' || status === '1' ? '正常' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Api.SystemManage.User) => (
        <Space>
          <Button type="link" onClick={() => handleEditRole(record)}>分配角色</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="mb-16px flex justify-between items-center">
        <h2 className="text-20px font-bold flex items-center">
          <SvgIcon icon="ant-design:user-outlined" className="mr-8px" />
          用户管理
        </h2>
      </div>
      
      <div className="bg-white p-16px rd-8px shadow-sm mb-16px">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="nickName" label="昵称">
            <Input placeholder="请输入" />
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

      <Modal
        title="分配角色"
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onOk={handleRoleSubmit}
        destroyOnClose
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item name="roleCodes" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select
              mode="multiple"
              placeholder="请选择角色"
              options={allRoles.map(r => ({ label: r.roleName, value: r.roleCode }))}
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
