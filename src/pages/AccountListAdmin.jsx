import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, ConfigProvider, Flex, Tag, Modal, Select, Input } from "antd";
import { AccountAdminAPI } from "../apis/accountadmin";
import axiosInstance from "../apis/axiosInstance";
import CreateAccountAdmin from "./CreateAccountAdmin";
import { SearchOutlined } from '@ant-design/icons';

export default function AccountListAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('active');
  const [searchFields, setSearchFields] = useState({ email: '', username: '', role: '' });
  const [editingAccount, setEditingAccount] = useState(null);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [roleToChange, setRoleToChange] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const data = await axiosInstance.get(`/Account/admin/all-account?status=${statusFilter}`);
        setAccounts(data.data);
      } catch (err) {
        message.error("Failed to fetch account list!");
      }
      setLoading(false);
    };
    fetchAccounts();
  }, [statusFilter]);

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await AccountAdminAPI.deleteAccount(userId);
      message.success("Deleted successfully!");
      const data = await axiosInstance.get(`/Account/admin/all-account?status=${statusFilter}`);
      setAccounts(data.data);
    } catch {
      message.error("Delete failed!");
    }
    setLoading(false);
  };

  const handleActivate = async (userId) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/Account/activate/${userId}`);
      message.success("Account activated!");
      const data = await axiosInstance.get(`/Account/admin/all-account?status=${statusFilter}`);
      setAccounts(data.data);
    } catch {
      message.error("Activate failed!");
    }
    setLoading(false);
  };

  const handleDeactivate = async (userId) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/Account/deactivate/${userId}`);
      message.success("Account deactivated!");
      const data = await axiosInstance.get(`/Account/admin/all-account?status=${statusFilter}`);
      setAccounts(data.data);
    } catch {
      message.error("Deactivate failed!");
    }
    setLoading(false);
  };

  const handleOpenUpdate = (account) => {
    setEditingAccount(account);
    setRoleToChange(account.role || '');
    setIsChangeRoleModalOpen(true);
  };

  const handleChangeRole = async () => {
    if (!editingAccount || !editingAccount.id) return;
    setLoading(true);
    try {
      await AccountAdminAPI.changeRole(editingAccount.id, roleToChange);
      message.success('Role updated successfully!');
      setIsChangeRoleModalOpen(false);
      setEditingAccount(null);
      const accounts = await AccountAdminAPI.getAllAccounts();
      setAccounts(accounts.data || accounts);
    } catch {
      message.error('Change role failed!');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchFields.email && !searchFields.username && !searchFields.role) {
        const data = await AccountAdminAPI.getAllAccounts();
        setAccounts(data.data || data);
      } else {
        const data = await AccountAdminAPI.searchAccounts(searchFields);
        setAccounts(data.data || data);
      }
    } catch (err) {
      message.error('Search failed!');
    }
    setLoading(false);
  };

  const columns = [
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Date of Birth", dataIndex: "dateOfBirth", key: "dateOfBirth", render: dob => dob ? new Date(dob).toLocaleDateString() : "" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Manager" ? "blue" : role === "Staff" ? "green" : "purple"}>{role}</Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap="small" wrap>
          <Button onClick={() => handleOpenUpdate(record)} type="primary">Update</Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          {statusFilter === 'active' && (
            <Button onClick={() => handleDeactivate(record.id)} type="default" danger>Deactivate</Button>
          )}
          {statusFilter === 'inactive' && (
            <Button onClick={() => handleActivate(record.id)} type="default">Activate</Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Account List</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
            <Input
              placeholder="Email"
              value={searchFields.email}
              onChange={e => setSearchFields(f => ({ ...f, email: e.target.value }))}
              style={{ width: 160 }}
              allowClear
            />
            <Input
              placeholder="Username"
              value={searchFields.username}
              onChange={e => setSearchFields(f => ({ ...f, username: e.target.value }))}
              style={{ width: 140 }}
              allowClear
            />
            <Select
              placeholder="Role"
              value={searchFields.role}
              onChange={value => setSearchFields(f => ({ ...f, role: value }))}
              style={{ width: 120 }}
              allowClear
              options={[
                { value: '', label: 'All Roles' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Staff', label: 'Staff' },
                { value: 'Consultant', label: 'Consultant' },
              ]}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{ borderRadius: 6 }}
            >
              Search
            </Button>
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 120, marginLeft: 8 }}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          </div>
          <Button
            type="primary"
            style={{
              borderRadius: 6,
              background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
              border: 'none'
            }}
            size="small"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Account
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          bordered
        />
        <Modal
          title="Change Role"
          open={isChangeRoleModalOpen}
          onCancel={() => setIsChangeRoleModalOpen(false)}
          onOk={handleChangeRole}
          okText="Save"
        >
          <Select
            value={roleToChange}
            onChange={setRoleToChange}
            style={{ width: '100%' }}
            options={[
              { value: 'Manager', label: 'Manager' },
              { value: 'Staff', label: 'Staff' },
              { value: 'Consultant', label: 'Consultant' },
            ]}
          />
        </Modal>
        <Modal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          footer={null}
          destroyOnHidden
        >
          <CreateAccountAdmin />
        </Modal>
      </div>
    </ConfigProvider>
  );
}
