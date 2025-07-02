import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Space, ConfigProvider, Flex, Tag, Modal, Form, Select, DatePicker, Input, Row, Col } from "antd";
import { AccountAdminAPI } from "../apis/accountadmin";
import axiosInstance from "../apis/axiosInstance";
import dayjs from "dayjs";
import CreateAccountAdmin from "./CreateAccountAdmin";

export default function AccountListAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('active');

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
    setIsModalOpen(true);
    form.setFieldsValue({
      ...account,
      newRole: account.role,
      dateOfBirth: account.dateOfBirth ? dayjs(account.dateOfBirth) : null,
    });
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    form.resetFields();
  };

  const handleSaveUpdate = async () => {
    if (!editingAccount || !editingAccount.id) {
      message.error("Cannot update: userId is missing!");
      return;
    }
    try {
      const values = await form.validateFields();
      setLoading(true);
      const data = {
        userName: values.userName,
        email: values.email,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
      };
      if (values.newPassword) {
        data.password = values.newPassword;
      }
      await AccountAdminAPI.updateAccountRole(
        editingAccount.id,
        values.newRole,
        data
      );
      message.success("Account updated successfully!");
      setIsModalOpen(false);
      setEditingAccount(null);
      const accounts = await axiosInstance.get(`/Account/admin/all-account?status=${statusFilter}`);
      setAccounts(accounts.data);
    } catch (err) {
      message.error("Update failed!");
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
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 160 }}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
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
          title="Update Account"
          open={isModalOpen}
          onCancel={handleCancelModal}
          onOk={handleSaveUpdate}
          okText="Save"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={editingAccount ? {
              ...editingAccount,
              newRole: editingAccount.role,
              dateOfBirth: editingAccount.dateOfBirth ? dayjs(editingAccount.dateOfBirth) : null,
            } : {}}
          >
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="User Name"
                  name="userName"
                  rules={[
                    { required: true, message: "Please enter username!" },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers and underscore!" },
                    { min: 4, message: "Username must be at least 4 characters!" }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: 'email', message: 'Please enter a valid email address!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter your full name!" },
                    { min: 2, message: "Full name must be at least 2 characters!" }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Please enter your phone number!" },
                    { pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits!" }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[{ required: true, message: "Please select date of birth!" }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Please select gender!" }]}
                >
                  <Select options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Role"
                  name="newRole"
                  rules={[{ required: true, message: "Please select role!" }]}
                >
                  <Select options={[
                    { value: "Manager", label: "Manager" },
                    { value: "Staff", label: "Staff" },
                    { value: "Consultant", label: "Consultant" },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    { min: 8, message: "Password must be at least 8 characters!" },
                    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, message: "Password must contain at least one uppercase letter, one lowercase letter, and one number!" }
                  ]}
                >
                  <Input.Password placeholder="Enter new password (optional)" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
