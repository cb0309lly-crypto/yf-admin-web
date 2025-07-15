import React, { useState } from 'react';
import { Table, Button, Space, Tag, Avatar } from 'antd';
import ButtonIcon from '@/components/ButtonIcon';
import SvgIcon from '@/components/SvgIcon';

interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: '管理员' | '用户' | '访客';
  status: '启用' | '禁用';
  createdAt: string;
  avatar?: string;
}

const initialUsers: User[] = [
  { id: 1, username: 'admin', nickname: '超级管理员', email: 'admin@test.com', role: '管理员', status: '启用', createdAt: '2024-06-01 09:00', avatar: '' },
  { id: 2, username: 'user1', nickname: '张三', email: 'user1@test.com', role: '用户', status: '启用', createdAt: '2024-06-01 10:00', avatar: '' },
  { id: 3, username: 'guest', nickname: '游客', email: 'guest@test.com', role: '访客', status: '禁用', createdAt: '2024-06-01 11:00', avatar: '' }
];

const statusColor: Record<User['status'], string> = {
  '启用': 'green',
  '禁用': 'red'
};

const roleColor: Record<User['role'], string> = {
  '管理员': 'gold',
  '用户': 'blue',
  '访客': 'default'
};

const UserManage: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (v: string) => <Avatar src={v} icon={<SvgIcon icon="ant-design:user-outlined" />} />
    },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (v: User['role']) => <Tag color={roleColor[v]}>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: User['status']) => <Tag color={statusColor[v]}>{v}</Tag> },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" icon={<SvgIcon icon="ant-design:eye-outlined" />}>查看</Button>
          <Button type="link" icon={<SvgIcon icon="ant-design:edit-outlined" />}>编辑</Button>
          <Button type="link" danger icon={<SvgIcon icon="ant-design:delete-outlined" />}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-16px">
      <div className="flex-y-center justify-between mb-16px">
        <h2 className="text-20px font-bold flex-y-center">
          <SvgIcon icon="ant-design:usergroup-add-outlined" className="mr-8px" />
          用户管理
        </h2>
        <ButtonIcon type="primary" icon="ant-design:plus-circle-outlined">
          新建用户
        </ButtonIcon>
      </div>
      <div className="bg-white rd-8px p-16px shadow-sm">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_function_user',
  icon: 'ant-design:usergroup-add-outlined',
  order: 5,
  title: '用户管理'
};

export default UserManage; 
  